import React from 'react';
import { useArchive } from '../context/ArchiveContext';
import { BookOpen, Search, Feather, ShieldCheck, Cpu, Lock, ArrowRight, Sparkles, Compass } from 'lucide-react';

export const EntrancePage: React.FC = () => {
  const { setActiveTab, memories } = useArchive();

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#D6AD62]">
              <span>Curatorial Open-AI Archive</span>
              <span aria-hidden="true">·</span>
              <span>Gothic Memory Preservation</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-numbers">{memories.length} Records</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F0E8D8] leading-[1.15] text-balance">
              Some stories refuse to disappear.
            </h1>

            <p className="text-lg sm:text-xl text-[#9E9689] font-editorial leading-relaxed max-w-2xl">
              An open-AI-powered archive for the memories, mysteries, and stories we cannot afford to lose.
              Preserve vintage letters, frost-rimmed journals, and ancestral accounts in a private, candlelit sanctuary.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setActiveTab('vault')}
                className="px-6 py-3.5 text-sm font-semibold tracking-wider uppercase text-[#0B0A0F] bg-[#D6AD62] hover:bg-[#E5BE72] rounded transition-all shadow-lg shadow-[#D6AD62]/10 flex items-center gap-2 cursor-pointer"
              >
                <span>Enter the Archive</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToHowItWorks}
                className="px-6 py-3.5 text-sm font-medium tracking-wide text-[#F0E8D8] hover:text-[#D6AD62] border border-[#D6AD62]/30 hover:border-[#D6AD62] rounded transition-colors bg-[#131219]/60 cursor-pointer"
              >
                Discover How It Works
              </button>
            </div>

            {/* Respectful Ethical Transparency Notice */}
            <div className="p-4 rounded border border-[#642D3A]/40 bg-[#642D3A]/10 text-xs text-[#9E9689] leading-relaxed max-w-xl">
              <span className="font-semibold text-[#D6AD62]">Archival Transparency:</span> This application does not contact or communicate with actual spirits or the deceased. All inquiries are strictly grounded in human historical texts. Ghost Mode is creative, atmospheric fictional storytelling inspired by archival fragments.
            </div>
          </div>

          {/* Right Column: Atmospheric Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden border border-[#D6AD62]/25 shadow-2xl bg-[#131219]">
              <img
                src="/src/assets/images/hero_candlelit_archive_1793283333830.jpg"
                alt="Ancient candlelit gothic archive with mahogany shelves and manuscript ledgers"
                className="w-full h-[400px] object-cover object-center transform hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A0F] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#F0E8D8]/80 font-editorial">
                <span>The Stacks at Midnight</span>
                <span className="font-mono-numbers text-[#D6AD62]">VOL. VII · CODEX 1888</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#D6AD62]">Core Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F0E8D8]">Three Sanctuaries of Memory</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => setActiveTab('vault')}
            className="group p-6 rounded-lg bg-[#131219] border border-[#D6AD62]/20 hover:border-[#D6AD62]/60 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded border border-[#D6AD62]/30 bg-[#642D3A]/20 flex items-center justify-center text-[#D6AD62] group-hover:border-[#D6AD62] transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F0E8D8] group-hover:text-[#D6AD62] transition-colors">
                Preserve the Past
              </h3>
              <p className="text-sm text-[#9E9689] leading-relaxed font-editorial">
                Store handwritten correspondence, frost-scoured journals, family records, and historical folklore. Extract transcripts from documents and images with archival metadata.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D6AD62]/10 flex items-center justify-between text-xs text-[#D6AD62]">
              <span>Explore Memory Vault</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => setActiveTab('ask')}
            className="group p-6 rounded-lg bg-[#131219] border border-[#D6AD62]/20 hover:border-[#D6AD62]/60 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded border border-[#D6AD62]/30 bg-[#642D3A]/20 flex items-center justify-center text-[#D6AD62] group-hover:border-[#D6AD62] transition-colors">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F0E8D8] group-hover:text-[#D6AD62] transition-colors">
                Ask the Archive
              </h3>
              <p className="text-sm text-[#9E9689] leading-relaxed font-editorial">
                Interrogate your records with grounded retrieval-augmented generation. Answers distinguish verified facts from interpretation and strictly refuse to fabricate events.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D6AD62]/10 flex items-center justify-between text-xs text-[#D6AD62]">
              <span>Inquire Records</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => setActiveTab('ghost')}
            className="group p-6 rounded-lg bg-[#131219] border border-[#D6AD62]/20 hover:border-[#D6AD62]/60 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded border border-[#D6AD62]/30 bg-[#642D3A]/20 flex items-center justify-center text-[#D6AD62] group-hover:border-[#D6AD62] transition-colors">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F0E8D8] group-hover:text-[#D6AD62] transition-colors">
                Enter Ghost Mode
              </h3>
              <p className="text-sm text-[#9E9689] leading-relaxed font-editorial">
                Transform fragments of history into atmospheric gothic tales. Select memories, configure intensity and style, and weave respectful, clearly labeled original fiction.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D6AD62]/10 flex items-center justify-between text-xs text-[#D6AD62]">
              <span>Enter Story Chamber</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. "How It Works" Architecture Diagram */}
      <section id="how-it-works-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-xl bg-[#131219] border border-[#D6AD62]/25 space-y-10">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#D6AD62]">Pipeline Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F0E8D8]">How the System Works</h2>
            <p className="text-sm text-[#9E9689] font-editorial">
              Clean separation between client records, deterministic retrieval pipelines, and open-weight model adapters.
            </p>
          </div>

          {/* Diagram Flow 1: Interrogation */}
          <div className="space-y-4">
            <div className="text-xs font-semibold tracking-wider text-[#D6AD62] uppercase">
              Pipeline 1: Document Question-Answering (Grounded RAG)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
              {[
                { step: '01', title: 'User Files', desc: 'Letters, Journals, TXT, MD, Images' },
                { step: '02', title: 'Text Extraction', desc: 'Native parser & OCR inspection' },
                { step: '03', title: 'Archive Search', desc: 'Keyword & passage relevance scoring' },
                { step: '04', title: 'Open-Weight AI', desc: 'Gemma 2 / Qwen 2.5 / Host Adapter' },
                { step: '05', title: 'Answer with Sources', desc: 'Facts vs interpretations with citations' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded bg-[#181622] border border-[#D6AD62]/15 text-center relative h-full flex flex-col justify-center"
                >
                  <span className="text-[10px] font-mono-numbers text-[#D6AD62]/70 uppercase tracking-widest">{item.step}</span>
                  <div className="text-sm font-semibold text-[#F0E8D8] mt-1">{item.title}</div>
                  <div className="text-[11px] text-[#9E9689] mt-1 font-editorial">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagram Flow 2: Ghost Storytelling */}
          <div className="space-y-4 pt-4 border-t border-[#D6AD62]/10">
            <div className="text-xs font-semibold tracking-wider text-[#D6AD62] uppercase">
              Pipeline 2: Ghost Mode Story Generation
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              {[
                { step: '01', title: 'Selected Memories', desc: 'User picks 1 to 5 inspiring documents' },
                { step: '02', title: 'Story Prompt', desc: 'Style, length, intensity, and grounding' },
                { step: '03', title: 'Open-Weight AI', desc: 'Gemma / Qwen narrative synthesis' },
                { step: '04', title: 'Clearly Labeled Fiction', desc: 'Gothic tale with source attribution' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded bg-[#181622] border border-[#D6AD62]/15 text-center relative h-full flex flex-col justify-center"
                >
                  <span className="text-[10px] font-mono-numbers text-[#D6AD62]/70 uppercase tracking-widest">{item.step}</span>
                  <div className="text-sm font-semibold text-[#F0E8D8] mt-1">{item.title}</div>
                  <div className="text-[11px] text-[#9E9689] mt-1 font-editorial">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Open Innovation Matters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#D6AD62]">Open-Source AI Hackathon</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F0E8D8]">Why Open Innovation Matters</h2>
          <p className="text-sm text-[#9E9689] font-editorial">
            Digital archives hold humanity's most intimate, irreplaceable memories. Locking them behind proprietary walled gardens is unacceptable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-[#131219] border border-[#D6AD62]/20 space-y-3">
            <div className="w-10 h-10 rounded border border-[#D6AD62]/30 bg-[#642D3A]/20 flex items-center justify-center text-[#D6AD62]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F0E8D8]">1. User Control Over Archives</h3>
            <p className="text-sm text-[#9E9689] leading-relaxed font-editorial">
              You own your records. Data resides in your browser and local filesystem. You can export complete JSON backups or raw Markdown manuscripts at any moment with zero vendor lock-in.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#131219] border border-[#D6AD62]/20 space-y-3">
            <div className="w-10 h-10 rounded border border-[#D6AD62]/30 bg-[#642D3A]/20 flex items-center justify-center text-[#D6AD62]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F0E8D8]">2. Freedom to Switch Models</h3>
            <p className="text-sm text-[#9E9689] leading-relaxed font-editorial">
              Swap freely between Gemma 2, Qwen 2.5, or any OpenAI-compatible runner. The modular AI adapter uncouples memory storage from inference engines, giving you perpetual software longevity.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#131219] border border-[#D6AD62]/20 space-y-3">
            <div className="w-10 h-10 rounded border border-[#D6AD62]/30 bg-[#642D3A]/20 flex items-center justify-center text-[#D6AD62]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F0E8D8]">3. 100% Private Offline Inference</h3>
            <p className="text-sm text-[#9E9689] leading-relaxed font-editorial">
              When paired with local Ollama or vLLM, not a single byte of your intimate family correspondence or diaries leaves your machine. Full RAG and storytelling run entirely without an internet connection.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Direct Jump to Vault */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="py-12 px-6 rounded-xl bg-gradient-to-r from-[#131219] via-[#1A1824] to-[#131219] border border-[#D6AD62]/30 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F0E8D8]">Ready to Step Into the Archives?</h2>
          <p className="text-sm text-[#9E9689] font-editorial max-w-xl mx-auto">
            Browse through 5 curated sample documents from 1845 to 1934, or clear them and begin your own family preservation ledger.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('vault')}
              className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#0B0A0F] bg-[#D6AD62] hover:bg-[#E5BE72] rounded transition-colors shadow-md cursor-pointer"
            >
              Enter the Memory Vault
            </button>
            <button
              onClick={() => setActiveTab('ask')}
              className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#F0E8D8] hover:text-[#D6AD62] border border-[#D6AD62]/30 hover:border-[#D6AD62] rounded transition-colors cursor-pointer"
            >
              Ask Sample Questions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
