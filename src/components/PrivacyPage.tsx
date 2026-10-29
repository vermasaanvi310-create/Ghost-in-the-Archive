import React, { useState } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { 
  ShieldCheck, Lock, Download, Trash2, Cpu, HardDrive, 
  ExternalLink, FileCode, CheckCircle2, AlertTriangle 
} from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { memories, purgeAllRecords, exportArchiveJSON, exportArchiveMarkdown, modelHealth } = useArchive();
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [purgedDone, setPurgedDone] = useState(false);

  const handlePurge = () => {
    purgeAllRecords();
    setShowPurgeConfirm(false);
    setPurgedDone(true);
    setTimeout(() => setPurgedDone(false), 3000);
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase text-[#D6AD62]">
          <span>Data Sovereignty & Integrity</span>
          <span aria-hidden="true">·</span>
          <span>Curatorial Manifesto</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F0E8D8] tracking-tight">
          Privacy and About
        </h1>
        <p className="text-sm text-[#9E9689] font-editorial leading-relaxed">
          Ghost in the Archive is built on the tenet that personal memories, family letters, and ancestral diaries must remain under the complete control of their stewards.
        </p>
      </div>

      {/* Honest Privacy Audit Matrix */}
      <div className="p-6 sm:p-8 rounded-xl bg-[#14121A] border border-[#D6AD62]/30 shadow-xl space-y-6">
        <h3 className="text-xl font-bold text-[#F0E8D8] border-b border-[#D6AD62]/15 pb-3">
          Archival Privacy Audit & Disclosure
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item 1: Where files are stored */}
          <div className="p-4 rounded bg-[#100F15] border border-[#D6AD62]/15 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F0E8D8]">
              <HardDrive className="w-4 h-4 text-[#D6AD62]" />
              <span>Where Archive Records Reside</span>
            </div>
            <p className="text-xs text-[#9E9689] font-editorial leading-relaxed">
              All memory records, transcripts, curatorial notes, and generated stories are stored locally in your browser's persistent storage (<code className="text-[#D6AD62]">localStorage</code>). No personal accounts or cloud database records are created without your explicit action.
            </p>
          </div>

          {/* Item 2: AI Processing (Local vs Remote) */}
          <div className="p-4 rounded bg-[#100F15] border border-[#D6AD62]/15 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F0E8D8]">
              <Cpu className="w-4 h-4 text-[#D6AD62]" />
              <span>Local vs. Remote AI Processing</span>
            </div>
            <p className="text-xs text-[#9E9689] font-editorial leading-relaxed">
              {modelHealth?.isLocal ? (
                <span className="text-emerald-300">
                  Currently running in verified <strong>Local Mode</strong>. Inference executes on your device via Ollama or custom local runner. Zero data leaves your machine.
                </span>
              ) : (
                <span>
                  Currently operating in <strong>Hosted Adapter Mode</strong>. During inquiries or story generation, only the specific query and relevant document passages are sent to the model server for inference.
                </span>
              )}
            </p>
          </div>

          {/* Item 3: Data Sent to Inference Provider */}
          <div className="p-4 rounded bg-[#100F15] border border-[#D6AD62]/15 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F0E8D8]">
              <Lock className="w-4 h-4 text-[#D6AD62]" />
              <span>What Data is Transmitted</span>
            </div>
            <p className="text-xs text-[#9E9689] font-editorial leading-relaxed">
              When querying the archive, our retrieval-augmented generation (RAG) algorithm sends only the top 1 to 3 matching document excerpts required to ground the answer. Unrelated memories in your vault remain untouched.
            </p>
          </div>

          {/* Item 4: Truth in Claims */}
          <div className="p-4 rounded bg-[#100F15] border border-[#D6AD62]/15 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F0E8D8]">
              <ShieldCheck className="w-4 h-4 text-[#D6AD62]" />
              <span>Honesty & Anti-Deception Policy</span>
            </div>
            <p className="text-xs text-[#9E9689] font-editorial leading-relaxed">
              We never claim a model is offline, local, or connected unless our verification endpoint verifies it. If no connection exists, the app gracefully falls back to deterministic local search without fake responses.
            </p>
          </div>
        </div>
      </div>

      {/* User Data Controls: Export & Delete */}
      <div className="p-6 sm:p-8 rounded-xl bg-[#14121A] border border-[#D6AD62]/30 shadow-xl space-y-6">
        <h3 className="text-xl font-bold text-[#F0E8D8] border-b border-[#D6AD62]/15 pb-3">
          Your Data Sovereign Rights
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded bg-[#100F15] border border-[#D6AD62]/15 space-y-3">
            <h4 className="text-sm font-bold text-[#F0E8D8] flex items-center gap-1.5">
              <Download className="w-4 h-4 text-[#D6AD62]" />
              <span>Export Your Full Archive</span>
            </h4>
            <p className="text-xs text-[#9E9689] font-editorial">
              Download your complete archive at any time. Formatted in standard JSON for digital backups, or pure Markdown for human reading in any text editor.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={exportArchiveJSON}
                className="px-3.5 py-1.5 text-xs font-medium text-[#F0E8D8] hover:text-[#D6AD62] border border-[#D6AD62]/30 rounded bg-[#131219] cursor-pointer"
              >
                Export JSON (.json)
              </button>
              <button
                onClick={exportArchiveMarkdown}
                className="px-3.5 py-1.5 text-xs font-medium text-[#F0E8D8] hover:text-[#D6AD62] border border-[#D6AD62]/30 rounded bg-[#131219] cursor-pointer"
              >
                Export Markdown (.md)
              </button>
            </div>
          </div>

          <div className="p-4 rounded bg-[#100F15] border border-[#D6AD62]/15 space-y-3">
            <h4 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Purge Local Archive</span>
            </h4>
            <p className="text-xs text-[#9E9689] font-editorial">
              Immediately wipe all deposited documents and generated stories from your local browser storage. No ghost records linger.
            </p>
            <div className="pt-1">
              {purgedDone ? (
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Archive purged successfully.</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowPurgeConfirm(true)}
                  className="px-3.5 py-1.5 text-xs font-medium text-rose-300 hover:text-white border border-rose-800/40 hover:bg-rose-950/60 rounded cursor-pointer"
                >
                  Purge All Records ({memories.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Open Source Components & Licensing */}
      <div className="p-6 sm:p-8 rounded-xl bg-[#14121A] border border-[#D6AD62]/30 shadow-xl space-y-4">
        <h3 className="text-xl font-bold text-[#F0E8D8] border-b border-[#D6AD62]/15 pb-3">
          Open Source Heritage & Component Licenses
        </h3>
        <p className="text-xs text-[#9E9689] font-editorial">
          Ghost in the Archive is assembled with respect for the open software commons:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { name: 'Gemma 2 Open Weights', provider: 'Google DeepMind', license: 'Gemma Open License' },
            { name: 'Qwen 2.5 Open Weights', provider: 'Alibaba Cloud', license: 'Apache 2.0' },
            { name: 'Ollama Runtime Adapter', provider: 'Ollama Community', license: 'MIT License' },
            { name: 'React 19 & TypeScript', provider: 'Meta & Microsoft', license: 'MIT License' },
            { name: 'Tailwind CSS v4', provider: 'Tailwind Labs', license: 'MIT License' },
            { name: 'Lucide Icons', provider: 'Lucide Community', license: 'ISC License' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded bg-[#100F15] border border-[#D6AD62]/15 space-y-1">
              <div className="font-bold text-[#F0E8D8]">{item.name}</div>
              <div className="text-[11px] text-[#9E9689]">{item.provider}</div>
              <div className="text-[10px] font-mono-numbers text-[#D6AD62]">{item.license}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showPurgeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14121A] border border-rose-500/40 rounded-lg p-6 max-w-md space-y-4 text-center">
            <h3 className="text-xl font-bold text-[#F0E8D8]">Confirm Complete Archive Deletion</h3>
            <p className="text-xs text-[#9E9689] font-editorial">
              Are you sure you want to delete all {memories.length} memories? This permanently clears your browser cache for this application.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowPurgeConfirm(false)}
                className="px-4 py-2 text-xs text-[#9E9689] hover:text-[#F0E8D8] border border-[#D6AD62]/20 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePurge}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded cursor-pointer"
              >
                Yes, Purge Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
