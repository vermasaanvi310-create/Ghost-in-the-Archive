import React, { useState } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { Sparkles, X, ChevronRight, BookOpen, Search, Feather, Info } from 'lucide-react';

export const DemoModeBar: React.FC = () => {
  const { setActiveTab, setSelectedMemory, memories } = useArchive();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const demoLetter = memories.find((m) => m.id === 'mem-1912-letter') || memories[0];
  const demoJournal = memories.find((m) => m.id === 'mem-1888-journal') || memories[1];
  const demoFolklore = memories.find((m) => m.id === 'mem-1845-folklore') || memories[2];

  return (
    <aside aria-label="Hackathon showcase tour" className="bg-[#171522] border-b border-[#D6AD62]/25 py-2 px-4 text-xs text-[#F0E8D8] z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#642D3A] text-[#D6AD62] border border-[#D6AD62]/30 uppercase">
            Hackathon Showcase
          </span>
          <span className="text-[#9E9689] hidden sm:inline font-editorial">
            Explore the 5 Core Milestones:
          </span>
        </div>

        {/* Milestone Quick Jump Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px]">
          <button
            onClick={() => {
              setActiveTab('vault');
              if (demoLetter) setSelectedMemory(demoLetter);
            }}
            className="px-2.5 py-1 rounded bg-[#100F15] hover:bg-[#201D2E] border border-[#D6AD62]/20 hover:border-[#D6AD62] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>1. Vintage Letter (1912)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('vault');
              if (demoJournal) setSelectedMemory(demoJournal);
            }}
            className="px-2.5 py-1 rounded bg-[#100F15] hover:bg-[#201D2E] border border-[#D6AD62]/20 hover:border-[#D6AD62] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>2. Journal Entry (1888)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('vault');
              if (demoFolklore) setSelectedMemory(demoFolklore);
            }}
            className="px-2.5 py-1 rounded bg-[#100F15] hover:bg-[#201D2E] border border-[#D6AD62]/20 hover:border-[#D6AD62] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>3. Folklore Document (1845)</span>
          </button>

          <button
            onClick={() => setActiveTab('ask')}
            className="px-2.5 py-1 rounded bg-[#100F15] hover:bg-[#201D2E] border border-[#D6AD62]/20 hover:border-[#D6AD62] transition-colors flex items-center gap-1 cursor-pointer text-[#D6AD62]"
          >
            <span>4. Grounded Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab('ghost')}
            className="px-2.5 py-1 rounded bg-[#100F15] hover:bg-[#201D2E] border border-[#D6AD62]/20 hover:border-[#D6AD62] transition-colors flex items-center gap-1 cursor-pointer text-[#D6AD62]"
          >
            <span>5. Ghost Mode Fiction</span>
          </button>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-[#9E9689] hover:text-[#F0E8D8] p-1 cursor-pointer"
          title="Dismiss showcase bar"
          aria-label="Dismiss showcase bar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
