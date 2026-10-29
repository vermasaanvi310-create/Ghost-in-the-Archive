import React, { useState } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { 
  StoryStyle, StoryLength, StoryIntensity, StoryGrounding, StoryRecord, MemoryItem 
} from '../types/archive';
import { 
  Feather, Sparkles, Copy, Download, RefreshCw, BookmarkPlus, 
  Trash2, BookOpen, AlertCircle, Check, Loader2, Info, ChevronRight, CheckSquare, Square
} from 'lucide-react';

const STYLES: StoryStyle[] = [
  'Victorian Ghost Story',
  'Gothic Mystery',
  'Haunted Library',
  'Forgotten Kingdom',
  'Gentle Remembrance',
];

const LENGTHS: StoryLength[] = ['Short', 'Medium', 'Long'];
const INTENSITIES: StoryIntensity[] = ['Eerie', 'Mysterious', 'Gentle'];
const GROUNDINGS: StoryGrounding[] = ['Inspired by Sources', 'Entirely Fictional'];

export const GhostChamberPage: React.FC = () => {
  const { memories, stories, addStory, deleteStory, modelConfig } = useArchive();

  // Selection of inspiring memories (default to first 2 if available)
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>(() => {
    return memories.slice(0, 2).map((m) => m.id);
  });

  const [style, setStyle] = useState<StoryStyle>('Victorian Ghost Story');
  const [length, setLength] = useState<StoryLength>('Medium');
  const [intensity, setIntensity] = useState<StoryIntensity>('Eerie');
  const [grounding, setGrounding] = useState<StoryGrounding>('Inspired by Sources');
  const [customPrompt, setCustomPrompt] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<StoryRecord | null>(stories[0] || null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleMemorySelection = (id: string) => {
    if (selectedMemoryIds.includes(id)) {
      setSelectedMemoryIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedMemoryIds((prev) => [...prev, id]);
    }
  };

  const handleGenerateStory = async () => {
    if (selectedMemoryIds.length === 0) {
      setErrorMessage('Please select at least one archival memory to inspire the story.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/ai/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memoryIds: selectedMemoryIds,
          memories,
          style,
          length,
          intensity,
          grounding,
          customPrompt,
          modelConfig,
        }),
      });

      if (!res.ok) {
        throw new Error(`Story synthesis failed with status ${res.status}`);
      }

      const storyData: StoryRecord = await res.json();
      setGeneratedStory(storyData);
    } catch (err: any) {
      setErrorMessage(err.message || 'The story chamber could not weave a tale.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToArchive = () => {
    if (!generatedStory) return;
    const exists = stories.some((s) => s.id === generatedStory.id);
    if (!exists) {
      addStory(generatedStory);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopyStory = () => {
    if (!generatedStory) return;
    const fullText = `[GHOST IN THE ARCHIVE — FICTION]
Title: ${generatedStory.title}
Style: ${generatedStory.style} · Intensity: ${generatedStory.intensity}
Inspired by: ${generatedStory.inspiredMemoryTitles.join(', ')}

${generatedStory.story}

(Generated for creative storytelling. Not actual historical record.)`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportStory = () => {
    if (!generatedStory) return;
    const content = `# ${generatedStory.title}
*A Gothic Fiction from the Story Chamber*
*Model: ${generatedStory.modelUsed}*
*Inspired by: ${generatedStory.inspiredMemoryTitles.join(', ')}*
*Archival Grounding: ${generatedStory.grounding}*

> **Notice**: This text is an original work of FICTION inspired by archival fragments. It does not represent historical fact or spirit communication.

---

${generatedStory.story}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `story_${generatedStory.title.toLowerCase().replace(/[^\w]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Studio Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase text-[#D6AD62]">
          <span>Gothic Narrative Synthesis</span>
          <span aria-hidden="true">·</span>
          <span>Ghost Mode</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F0E8D8] tracking-tight">
          The Story Chamber
        </h1>
        <p className="text-sm text-[#9E9689] font-editorial leading-relaxed">
          Select real historical memories to inspire original gothic fiction. Each tale is strictly labeled as creative literature, honoring the boundary between historical truth and haunting imagination.
        </p>
      </div>

      {/* Main 2-Column Split: Controls on Left, Reading Chamber on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Memory Selector & Story Parameters */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Select Inspiring Memories */}
          <div className="p-5 rounded-lg bg-[#131219] border border-[#D6AD62]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#D6AD62]">
                1. Select Inspiring Memories ({selectedMemoryIds.length})
              </span>
              <button
                onClick={() => {
                  if (selectedMemoryIds.length === memories.length) {
                    setSelectedMemoryIds([]);
                  } else {
                    setSelectedMemoryIds(memories.map((m) => m.id));
                  }
                }}
                className="text-[11px] text-[#9E9689] hover:text-[#D6AD62] cursor-pointer"
              >
                {selectedMemoryIds.length === memories.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {memories.map((mem) => {
                const isChecked = selectedMemoryIds.includes(mem.id);
                return (
                  <div
                    key={mem.id}
                    onClick={() => toggleMemorySelection(mem.id)}
                    className={`p-2.5 rounded border transition-colors cursor-pointer flex items-start gap-2.5 text-xs ${
                      isChecked
                        ? 'bg-[#1C1825] border-[#D6AD62]/50 text-[#F0E8D8]'
                        : 'bg-[#100F15] border-[#D6AD62]/10 text-[#9E9689] hover:border-[#D6AD62]/30'
                    }`}
                  >
                    <div className="mt-0.5 text-[#D6AD62]">
                      {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-semibold truncate text-[#F0E8D8]">{mem.title}</div>
                      <div className="text-[10px] text-[#9E9689] font-mono-numbers">
                        {mem.category} · {mem.date}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Story Configuration Settings */}
          <div className="p-5 rounded-lg bg-[#131219] border border-[#D6AD62]/20 space-y-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#D6AD62] block">
              2. Atmospheric Directives
            </span>

            {/* Style Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#9E9689]">Story Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as StoryStyle)}
                className="w-full px-3 py-2 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-xs text-[#F0E8D8] cursor-pointer"
              >
                {STYLES.map((st) => (
                  <option key={st} value={st} className="bg-[#14121A]">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Length & Intensity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-[#9E9689]">Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as StoryLength)}
                  className="w-full px-3 py-2 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-xs text-[#F0E8D8] cursor-pointer"
                >
                  {LENGTHS.map((l) => (
                    <option key={l} value={l} className="bg-[#14121A]">
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#9E9689]">Intensity</label>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value as StoryIntensity)}
                  className="w-full px-3 py-2 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-xs text-[#F0E8D8] cursor-pointer"
                >
                  {INTENSITIES.map((int) => (
                    <option key={int} value={int} className="bg-[#14121A]">
                      {int}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Historical Grounding */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#9E9689]">Historical Grounding</label>
              <select
                value={grounding}
                onChange={(e) => setGrounding(e.target.value as StoryGrounding)}
                className="w-full px-3 py-2 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-xs text-[#F0E8D8] cursor-pointer"
              >
                {GROUNDINGS.map((g) => (
                  <option key={g} value={g} className="bg-[#14121A]">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Writer Note */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#9E9689]">Optional Narrative Focus</label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Focus on the cold wind through the lighthouse tower..."
                className="w-full px-3 py-2 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-xs text-[#F0E8D8]"
              />
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-3 rounded bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Generate Trigger */}
            <button
              onClick={handleGenerateStory}
              disabled={isGenerating || selectedMemoryIds.length === 0}
              className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-[#0B0A0F] bg-[#D6AD62] hover:bg-[#E5BE72] disabled:opacity-40 rounded transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Weaving Gothic Narrative...</span>
                </>
              ) : (
                <>
                  <Feather className="w-4 h-4" />
                  <span>Weave Story from Archive</span>
                </>
              )}
            </button>
          </div>

          {/* Saved Stories Reel */}
          {stories.length > 0 && (
            <div className="p-5 rounded-lg bg-[#131219] border border-[#D6AD62]/20 space-y-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#D6AD62] block">
                Saved Tales in Chamber ({stories.length})
              </span>
              <div className="space-y-2">
                {stories.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setGeneratedStory(s)}
                    className={`p-3 rounded border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      generatedStory?.id === s.id
                        ? 'bg-[#1C1825] border-[#D6AD62]/50 text-[#F0E8D8]'
                        : 'bg-[#100F15] border-[#D6AD62]/10 text-[#9E9689] hover:border-[#D6AD62]/30'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold truncate text-[#F0E8D8]">{s.title}</div>
                      <div className="text-[10px] text-[#9E9689]">
                        {s.style} · {s.intensity}
                      </div>
                    </div>
                    {stories.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteStory(s.id);
                        }}
                        className="text-[#9E9689] hover:text-rose-400 p-1"
                        title="Delete saved story"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: The Reading Chamber */}
        <div className="lg:col-span-7">
          {generatedStory ? (
            <div className="p-6 sm:p-10 rounded-xl bg-[#14121A] border border-[#D6AD62]/30 shadow-2xl space-y-6">
              {/* Mandatory Fiction Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D6AD62]/15 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#642D3A] text-[#F0E8D8] border border-[#D6AD62]/30">
                    FICTION · CREATIVE ADAPTATION
                  </span>
                  <span className="text-[#9E9689]">
                    {generatedStory.style} ({generatedStory.intensity})
                  </span>
                </div>
                <div className="text-[11px] font-mono-numbers text-[#D6AD62]">
                  ~{generatedStory.readTimeMinutes || 3} min read
                </div>
              </div>

              {/* Story Title & Provenance */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F0E8D8] font-title leading-tight">
                  {generatedStory.title}
                </h2>
                <div className="text-xs text-[#9E9689] font-editorial">
                  <span>Model: {generatedStory.modelUsed}</span>
                  <span className="mx-2">·</span>
                  <span>Grounding: {generatedStory.grounding}</span>
                </div>
              </div>

              {/* Inspiring Memories Citation Box */}
              {generatedStory.inspiredMemoryTitles && generatedStory.inspiredMemoryTitles.length > 0 && (
                <div className="p-3.5 rounded bg-[#100F15] border border-[#D6AD62]/15 text-xs text-[#9E9689] space-y-1">
                  <span className="font-semibold text-[#D6AD62] uppercase tracking-wider text-[10px]">
                    Archival Records Inspiring This Fiction:
                  </span>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {generatedStory.inspiredMemoryTitles.map((title, idx) => (
                      <span key={idx} className="text-[#F0E8D8] font-editorial italic">
                        "{title}"{idx < generatedStory.inspiredMemoryTitles.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Story Prose with Drop Cap */}
              <div className="p-6 sm:p-8 rounded bg-[#100F15]/80 border border-[#D6AD62]/15 font-manuscript text-sm sm:text-base leading-[1.85] text-[#F0E8D8] space-y-4 whitespace-pre-wrap selection:bg-[#642D3A]">
                {generatedStory.story}
              </div>

              {/* Action Toolbar: Regenerate, Save, Copy, Export */}
              <div className="pt-4 border-t border-[#D6AD62]/15 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateStory}
                    disabled={isGenerating}
                    className="px-3.5 py-2 text-xs font-medium text-[#F0E8D8] hover:text-[#D6AD62] border border-[#D6AD62]/20 hover:border-[#D6AD62] rounded bg-[#131219] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
                  </button>

                  <button
                    onClick={handleSaveToArchive}
                    className="px-3.5 py-2 text-xs font-medium text-[#F0E8D8] hover:text-[#D6AD62] border border-[#D6AD62]/20 hover:border-[#D6AD62] rounded bg-[#131219] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Saved</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-3.5 h-3.5 text-[#D6AD62]" />
                        <span>Save Story</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyStory}
                    className="px-3.5 py-2 text-xs font-medium text-[#F0E8D8] hover:text-[#D6AD62] border border-[#D6AD62]/20 hover:border-[#D6AD62] rounded bg-[#131219] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleExportStory}
                    className="px-3.5 py-2 text-xs font-medium text-[#F0E8D8] hover:text-[#D6AD62] border border-[#D6AD62]/20 hover:border-[#D6AD62] rounded bg-[#131219] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export MD</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-[#131219] border border-[#D6AD62]/20 space-y-4">
              <Feather className="w-10 h-10 text-[#D6AD62] mx-auto" />
              <h3 className="text-xl font-bold text-[#F0E8D8]">The Chamber Awaits</h3>
              <p className="text-xs text-[#9E9689] font-editorial max-w-md mx-auto">
                Select your inspiring archival documents on the left and configure the narrative tone to begin weaving.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
