export type Category =
  | 'Family Stories'
  | 'Letters'
  | 'Photographs'
  | 'Historical Documents'
  | 'Journals'
  | 'Folklore'
  | 'Other';

export interface MemoryItem {
  id: string;
  accessionNumber: string;
  title: string;
  date: string;
  year?: number;
  category: Category;
  description: string;
  content: string;
  author: string;
  recipient?: string;
  location?: string;
  tags: string[];
  imageUrl?: string;
  imageAlt?: string;
  originalFileName?: string;
  fileType?: string;
  createdDate: string;
  isDemo?: boolean;
}

export type StoryStyle =
  | 'Gothic Mystery'
  | 'Haunted Library'
  | 'Forgotten Kingdom'
  | 'Victorian Ghost Story'
  | 'Gentle Remembrance';

export type StoryLength = 'Short' | 'Medium' | 'Long';
export type StoryIntensity = 'Eerie' | 'Mysterious' | 'Gentle';
export type StoryGrounding = 'Inspired by Sources' | 'Entirely Fictional';

export interface StoryRecord {
  id: string;
  title: string;
  story: string;
  style: StoryStyle;
  length: StoryLength;
  intensity: StoryIntensity;
  grounding: StoryGrounding;
  inspiredMemoryIds: string[];
  inspiredMemoryTitles: string[];
  createdAt: string;
  isFiction: boolean;
  modelUsed: string;
  readTimeMinutes?: number;
}

export type ModelInferenceMode = 'gemini_server' | 'ollama_local' | 'custom_endpoint';

export interface ModelConfig {
  mode: ModelInferenceMode;
  ollamaUrl: string;
  ollamaModel: string;
  customEndpointUrl: string;
  customModelName: string;
}

export interface ModelHealth {
  status: 'connected' | 'fallback_ready' | 'offline_search' | 'error';
  provider: string;
  model: string;
  license: string;
  isLocal: boolean;
  isOfflineCapable: boolean;
  latencyMs?: number;
  details: string;
  verifiedAt: string;
}

export interface SourceCitation {
  id: string;
  accessionNumber: string;
  title: string;
  date: string;
  category: Category;
  excerpt: string;
}

export interface AnswerResponse {
  answer: string;
  hasSufficientData: boolean;
  documentedFacts: string[];
  interpretations: string[];
  sources: SourceCitation[];
  isInferenceLocal: boolean;
  modelUsed: string;
  inferenceMode: string;
}
