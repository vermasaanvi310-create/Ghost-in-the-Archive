import React, { useState } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { archiveAudio } from '../utils/ambientSound';
import { Volume2, VolumeX, Menu, X, Sparkles, BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, ambientSoundActive, setAmbientSoundActive, memories } = useArchive();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const newState = archiveAudio.toggle();
    setAmbientSoundActive(newState);
  };

  const navLinks = [
    { id: 'entrance', label: 'Entrance' },
    { id: 'vault', label: `Memory Vault (${memories.length})` },
    { id: 'ask', label: 'Ask Archive' },
    { id: 'ghost', label: 'Ghost Mode' },
    { id: 'lab', label: 'Open AI Lab' },
    { id: 'privacy', label: 'Privacy & About' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0A0F]/90 backdrop-blur-md border-b border-[#D6AD62]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single element wordmark */}
        <button
          onClick={() => { setActiveTab('entrance'); setMobileMenuOpen(false); }}
          className="text-left font-title text-lg sm:text-xl font-bold tracking-wider text-[#F0E8D8] hover:text-[#D6AD62] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rotate-45 border border-[#D6AD62] bg-[#642D3A] inline-block" />
          <span>GHOST IN THE ARCHIVE</span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#9E9689]">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer relative py-1 ${
                  isActive
                    ? 'text-[#D6AD62] font-semibold'
                    : 'text-[#9E9689] hover:text-[#F0E8D8]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D6AD62]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action & Ambient sound toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            title={ambientSoundActive ? 'Mute candlelit hearth sound' : 'Enable ambient candlelit hearth sound'}
            className={`p-2 rounded border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              ambientSoundActive
                ? 'border-[#D6AD62] text-[#D6AD62] bg-[#642D3A]/20'
                : 'border-[#D6AD62]/20 text-[#9E9689] hover:text-[#F0E8D8] hover:border-[#D6AD62]/40'
            }`}
          >
            {ambientSoundActive ? <Volume2 className="w-4 h-4 text-[#D6AD62]" /> : <VolumeX className="w-4 h-4 text-[#9E9689]" />}
            <span className="hidden sm:inline font-mono-numbers text-[11px]">
              {ambientSoundActive ? 'Sound: On' : 'Sound: Off'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className="px-4 py-2 text-xs font-medium tracking-wide uppercase text-[#0B0A0F] bg-[#D6AD62] hover:bg-[#E5BE72] rounded transition-colors whitespace-nowrap shrink-0 shadow-sm font-semibold cursor-pointer"
          >
            Open Vault
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#9E9689] hover:text-[#F0E8D8] border border-[#D6AD62]/20 rounded cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#131219] border-b border-[#D6AD62]/20 px-6 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 text-sm transition-colors ${
                activeTab === link.id ? 'text-[#D6AD62] font-semibold' : 'text-[#9E9689] hover:text-[#F0E8D8]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
