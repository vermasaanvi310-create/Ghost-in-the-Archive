import React, { createContext, useContext, useState, useEffect } from 'react';
import { MemoryItem, StoryRecord, ModelConfig, ModelHealth, Category } from '../types/archive';
import { SAMPLE_MEMORIES, SAMPLE_GHOST_STORY } from '../data/sampleMemories';

interface ArchiveContextType {
  memories: MemoryItem[];
  stories: StoryRecord[];
  activeTab: 'entrance' | 'vault' | 'ask' | 'ghost' | 'lab' | 'privacy';
  setActiveTab: (tab: 'entrance' | 'vault' | 'ask' | 'ghost' | 'lab' | 'privacy') => void;
  selectedMemory: MemoryItem | null;
  setSelectedMemory: (m: MemoryItem | null) => void;
  addMemory: (m: Omit<MemoryItem, 'id' | 'createdDate' | 'accessionNumber'>) => MemoryItem;
  updateMemory: (id: string, m: Partial<MemoryItem>) => void;
  deleteMemory: (id: string) => void;
  restoreSampleRecords: () => void;
  purgeAllRecords: () => void;
  addStory: (story: StoryRecord) => void;
  deleteStory: (id: string) => void;
  modelConfig: ModelConfig;
  setModelConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
  modelHealth: ModelHealth | null;
  checkModelHealth: () => Promise<void>;
  ambientSoundActive: boolean;
  setAmbientSoundActive: (val: boolean) => void;
  exportArchiveJSON: () => void;
  exportArchiveMarkdown: () => void;
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

const MEMORIES_STORAGE_KEY = 'ghost_archive_memories_v2';
const STORIES_STORAGE_KEY = 'ghost_archive_stories_v2';
const MODEL_CONFIG_KEY = 'ghost_archive_model_config_v2';

export const ArchiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'entrance' | 'vault' | 'ask' | 'ghost' | 'lab' | 'privacy'>('entrance');
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [ambientSoundActive, setAmbientSoundActive] = useState<boolean>(false);

  // Initialize memories from localStorage or load demo memories
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(MEMORIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored memories:', e);
    }
    return SAMPLE_MEMORIES;
  });

  // Initialize stories
  const [stories, setStories] = useState<StoryRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored stories:', e);
    }
    return [SAMPLE_GHOST_STORY];
  });

  // Model configuration
  const [modelConfig, setModelConfig] = useState<ModelConfig>(() => {
    try {
      const stored = localStorage.getItem(MODEL_CONFIG_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // Ignore
    }
    return {
      mode: 'gemini_server',
      ollamaUrl: 'http://localhost:11434',
      ollamaModel: 'gemma2:9b',
      customEndpointUrl: 'http://localhost:8000/v1',
      customModelName: 'Qwen/Qwen2.5-7B-Instruct',
    };
  });

  const [modelHealth, setModelHealth] = useState<ModelHealth | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(memories));
    } catch (e) {
      console.error('Storage limit reached:', e);
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories));
    } catch (e) {
      console.error('Storage limit reached:', e);
    }
  }, [stories]);

  useEffect(() => {
    try {
      localStorage.setItem(MODEL_CONFIG_KEY, JSON.stringify(modelConfig));
    } catch (e) {
      console.error('Failed to save model config:', e);
    }
  }, [modelConfig]);

  const checkModelHealth = async () => {
    try {
      const params = new URLSearchParams({
        mode: modelConfig.mode,
        ollamaUrl: modelConfig.ollamaUrl,
        ollamaModel: modelConfig.ollamaModel,
      });
      const res = await fetch(`/api/ai/health?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setModelHealth(data);
      }
    } catch (e) {
      setModelHealth({
        status: 'error',
        provider: 'Connection Error',
        model: 'None',
        license: 'N/A',
        isLocal: false,
        isOfflineCapable: false,
        details: 'Unable to reach backend health endpoint. Please verify server status.',
        verifiedAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    checkModelHealth();
  }, [modelConfig.mode, modelConfig.ollamaUrl, modelConfig.ollamaModel]);

  const addMemory = (item: Omit<MemoryItem, 'id' | 'createdDate' | 'accessionNumber'>) => {
    const yearMatch = item.date.match(/\b(17\d\d|18\d\d|19\d\d|20\d\d)\b/);
    const parsedYear = yearMatch ? parseInt(yearMatch[0], 10) : undefined;
    const count = memories.length + 1;
    const accessionNumber = `ACC-${parsedYear || new Date().getFullYear()}-${String(count).padStart(4, '0')}`;

    const newRecord: MemoryItem = {
      ...item,
      id: `mem-${Date.now()}`,
      accessionNumber,
      year: parsedYear,
      createdDate: new Date().toISOString().split('T')[0],
      isDemo: false,
    };

    setMemories((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateMemory = (id: string, updatedFields: Partial<MemoryItem>) => {
    setMemories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    if (selectedMemory?.id === id) {
      setSelectedMemory((prev) => (prev ? { ...prev, ...updatedFields } : null));
    }
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((item) => item.id !== id));
    if (selectedMemory?.id === id) {
      setSelectedMemory(null);
    }
  };

  const restoreSampleRecords = () => {
    setMemories(SAMPLE_MEMORIES);
  };

  const purgeAllRecords = () => {
    setMemories([]);
    setSelectedMemory(null);
  };

  const addStory = (story: StoryRecord) => {
    setStories((prev) => [story, ...prev]);
  };

  const deleteStory = (id: string) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  const exportArchiveJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ghost_archive_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportArchiveMarkdown = () => {
    let md = `# Ghost in the Archive — Complete Records Export\nExported on: ${new Date().toLocaleString()}\nTotal Records: ${memories.length}\n\n---\n\n`;
    memories.forEach((item, idx) => {
      md += `## ${idx + 1}. ${item.title}\n`;
      md += `- **Accession Number**: ${item.accessionNumber}\n`;
      md += `- **Date**: ${item.date}\n`;
      md += `- **Category**: ${item.category}\n`;
      md += `- **Author**: ${item.author}\n`;
      if (item.recipient) md += `- **Recipient**: ${item.recipient}\n`;
      if (item.location) md += `- **Location**: ${item.location}\n`;
      md += `- **Tags**: ${item.tags.join(', ')}\n\n`;
      md += `### Description\n${item.description}\n\n`;
      md += `### Transcript / Content\n\`\`\`\n${item.content}\n\`\`\`\n\n---\n\n`;
    });

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ghost_archive_manuscripts_${new Date().toISOString().split('T')[0]}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <ArchiveContext.Provider
      value={{
        memories,
        stories,
        activeTab,
        setActiveTab,
        selectedMemory,
        setSelectedMemory,
        addMemory,
        updateMemory,
        deleteMemory,
        restoreSampleRecords,
        purgeAllRecords,
        addStory,
        deleteStory,
        modelConfig,
        setModelConfig,
        modelHealth,
        checkModelHealth,
        ambientSoundActive,
        setAmbientSoundActive,
        exportArchiveJSON,
        exportArchiveMarkdown,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};

export const useArchive = () => {
  const context = useContext(ArchiveContext);
  if (!context) throw new Error('useArchive must be used within ArchiveProvider');
  return context;
};
