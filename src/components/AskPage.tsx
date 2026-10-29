import React, { useState } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { AnswerResponse, SourceCitation } from '../types/archive';
import { 
  Search, Send, Sparkles, BookOpen, ExternalLink, 
  AlertCircle, CheckCircle2, ShieldCheck, HelpCircle, Loader2 
} from 'lucide-react';
import { MemoryDetailModal } from './MemoryDetailModal';

const SUGGESTED_INQUIRIES = [
  'Which memories mention a winter celebration?',
  'What does Arthur write to Eleanor about the cliffs and his father?',
  'Summarize the unexplained events recorded at Oakhaven lighthouse.',
  'What folklore is recorded about the Old Grain Mill upon the River Wyre?',
  'What information do we have regarding the watchmaker Julian and his locket?',
  'Did anyone in the records travel to Venice in 1950?', // Negative test case to verify "archive does not contain enough info"
];

export const AskPage: React.FC = () => {
  const { memories, modelConfig, modelHealth, selectedMemory, setSelectedMemory } = useArchive();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AnswerResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInquire = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery.trim(),
          memories,
          modelConfig,
        }),
      });

      if (!res.ok) {
        throw new Error(`Inquiry request failed (${res.status})`);
      }

      const data: AnswerResponse = await res.json();
      setCurrentResponse(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Archival query could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSource = (citation: SourceCitation) => {
    const mem = memories.find((m) => m.id === citation.id);
    if (mem) {
      setSelectedMemory(mem);
    }
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase text-[#D6AD62]">
          <span>Grounded Archival Interrogation</span>
          <span aria-hidden="true">·</span>
          <span>RAG Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F0E8D8] tracking-tight">
          Ask the Archive
        </h1>
        <p className="text-sm text-[#9E9689] font-editorial leading-relaxed">
          Inquire into historical records, letters, and logs. Answers are strictly grounded in human documents; the archive distinguishes verified facts from interpretation and never fabricates memories.
        </p>
      </div>

      {/* Suggested Inquiries */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#D6AD62] flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Curated Archival Inquiries (Click to Ask)</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_INQUIRIES.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(sq);
                handleInquire(sq);
              }}
              className="text-left px-3 py-1.5 rounded bg-[#131219] hover:bg-[#1A1823] border border-[#D6AD62]/20 hover:border-[#D6AD62]/60 text-xs text-[#F0E8D8] transition-colors cursor-pointer"
            >
              "{sq}"
            </button>
          ))}
        </div>
      </div>

      {/* Query Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleInquire(query);
        }}
        className="relative flex items-center"
      >
        <Search className="absolute left-4 w-5 h-5 text-[#9E9689]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about authors, events, dates, celebrations, or mysteries..."
          className="w-full pl-12 pr-28 py-3.5 rounded-lg bg-[#131219] border border-[#D6AD62]/30 focus:border-[#D6AD62] focus:outline-none text-sm text-[#F0E8D8] shadow-lg placeholder-[#9E9689]/60"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0B0A0F] bg-[#D6AD62] hover:bg-[#E5BE72] disabled:opacity-40 rounded transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Searching</span>
            </>
          ) : (
            <>
              <span>Inquire</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Answer Output Presentation */}
      {currentResponse && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Answer Parchment Card */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#14121A] border border-[#D6AD62]/30 shadow-xl space-y-6">
            {/* Model Badge Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D6AD62]/15 text-xs text-[#9E9689]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#D6AD62]">Keeper's Response</span>
                <span aria-hidden="true">·</span>
                <span>{currentResponse.modelUsed}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{currentResponse.inferenceMode}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#D6AD62]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Strict Grounding Enforced</span>
              </div>
            </div>

            {/* Answer Text */}
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-editorial text-[#F0E8D8] leading-relaxed">
                {currentResponse.answer}
              </p>
            </div>

            {/* Negative Fallback Notice if Archive Lacks Info */}
            {!currentResponse.hasSufficientData && (
              <div className="p-4 rounded bg-[#1A1823] border border-[#D6AD62]/20 text-xs text-[#9E9689] space-y-1">
                <div className="font-semibold text-[#D6AD62]">Archival Integrity Guarantee:</div>
                <p>
                  No documents in the repository contain records answering this inquiry. In accordance with archival principles, the model refuses to fabricate dates, persons, or historical events.
                </p>
              </div>
            )}

            {/* Documented Facts vs Interpretations Breakdown */}
            {currentResponse.hasSufficientData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#D6AD62]/15">
                {/* Documented Facts */}
                <div className="p-4 rounded bg-[#100F15] border border-[#D6AD62]/15 space-y-2">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400/90 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Documented Facts</span>
                  </span>
                  {currentResponse.documentedFacts && currentResponse.documentedFacts.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-[#F0E8D8]/90 font-editorial">
                      {currentResponse.documentedFacts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#D6AD62] select-none">·</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#9E9689] italic">No isolated fact list provided.</p>
                  )}
                </div>

                {/* Interpretations */}
                <div className="p-4 rounded bg-[#100F15] border border-[#D6AD62]/15 space-y-2">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#D6AD62] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curatorial Observations / Interpretation</span>
                  </span>
                  {currentResponse.interpretations && currentResponse.interpretations.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-[#9E9689] font-editorial">
                      {currentResponse.interpretations.map((interp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#D6AD62] select-none">·</span>
                          <span>{interp}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#9E9689] italic">No speculative interpretations made.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Source Citations */}
          {currentResponse.sources && currentResponse.sources.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#D6AD62]">
                Cited Source Documents ({currentResponse.sources.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentResponse.sources.map((source) => (
                  <div
                    key={source.id}
                    className="p-4 rounded-lg bg-[#131219] border border-[#D6AD62]/20 hover:border-[#D6AD62]/50 transition-colors space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] text-[#9E9689]">
                        <span className="font-mono-numbers text-[#D6AD62]">{source.accessionNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{source.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{source.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#F0E8D8] leading-snug">
                        {source.title}
                      </h4>
                      <p className="text-xs text-[#9E9689] font-editorial line-clamp-3 italic">
                        "{source.excerpt}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#D6AD62]/10 flex items-center justify-end">
                      <button
                        onClick={() => handleOpenSource(source)}
                        className="text-xs text-[#D6AD62] hover:text-[#F0E8D8] flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <span>Open Document Record</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Source Detail Modal */}
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onEdit={() => {}}
        />
      )}
    </div>
  );
};
