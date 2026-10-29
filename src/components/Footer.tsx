import React from 'react';
import { useArchive } from '../context/ArchiveContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useArchive();

  return (
    <footer className="relative z-10 w-full border-t border-[#D6AD62]/15 bg-[#0B0A0F] py-12 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-[#9E9689]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="font-title text-sm font-bold tracking-wider text-[#F0E8D8]">
            GHOST IN THE ARCHIVE
          </div>
          <p className="font-editorial text-xs text-[#9E9689]">
            A private digital memory archive for the “Ghost in the Machine” Open-Source AI Hackathon.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('entrance')}
            className="hover:text-[#D6AD62] transition-colors cursor-pointer"
          >
            Entrance
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className="hover:text-[#D6AD62] transition-colors cursor-pointer"
          >
            Memory Vault
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className="hover:text-[#D6AD62] transition-colors cursor-pointer"
          >
            Ask the Archive
          </button>
          <button
            onClick={() => setActiveTab('ghost')}
            className="hover:text-[#D6AD62] transition-colors cursor-pointer"
          >
            Ghost Mode
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className="hover:text-[#D6AD62] transition-colors cursor-pointer"
          >
            Open AI Lab
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className="hover:text-[#D6AD62] transition-colors cursor-pointer"
          >
            Privacy & About
          </button>
        </div>

        <div className="text-[11px] text-[#9E9689]/70 text-center md:text-right">
          <span>Crafted with Gemma 2 & Qwen 2.5 Open Weights</span>
          <br />
          <span>Local Sovereign Data · No Spiritual Communion Claimed</span>
        </div>
      </div>
    </footer>
  );
};
