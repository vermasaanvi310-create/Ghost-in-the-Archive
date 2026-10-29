import React, { useState } from 'react';
import { MemoryItem } from '../types/archive';
import { useArchive } from '../context/ArchiveContext';
import { X, Trash2, Edit3, Download, Sparkles, MapPin, User, Calendar, Tag, ShieldAlert } from 'lucide-react';

interface MemoryDetailModalProps {
  memory: MemoryItem | null;
  onClose: () => void;
  onEdit: (m: MemoryItem) => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({ memory, onClose, onEdit }) => {
  const { deleteMemory, setActiveTab } = useArchive();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!memory) return null;

  const handleDelete = () => {
    deleteMemory(memory.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleDownloadSingle = () => {
    const textContent = `ACCESS NUMBER: ${memory.accessionNumber}
TITLE: ${memory.title}
DATE: ${memory.date}
CATEGORY: ${memory.category}
AUTHOR: ${memory.author}
${memory.recipient ? `RECIPIENT: ${memory.recipient}\n` : ''}${memory.location ? `LOCATION: ${memory.location}\n` : ''}TAGS: ${memory.tags.join(', ')}

DESCRIPTION / CURATORIAL NOTES:
${memory.description}

FULL TRANSCRIPT / MANUSCRIPT:
${memory.content}
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${memory.accessionNumber}_${memory.title.toLowerCase().replace(/[^\w]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#14121A] border border-[#D6AD62]/30 rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#F0E8D8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D6AD62]/20 bg-[#171520]">
          <div className="flex items-center gap-3 text-xs text-[#9E9689]">
            <span className="font-mono-numbers text-[#D6AD62] tracking-wider">{memory.accessionNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{memory.category}</span>
            {memory.isDemo && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#D6AD62]/70 font-semibold uppercase text-[10px] tracking-wider">Demo Record</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSingle}
              title="Download text transcript"
              className="p-1.5 rounded hover:bg-[#642D3A]/30 text-[#9E9689] hover:text-[#D6AD62] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(memory)}
              title="Edit record"
              className="p-1.5 rounded hover:bg-[#642D3A]/30 text-[#9E9689] hover:text-[#D6AD62] transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete record"
              className="p-1.5 rounded hover:bg-rose-950/40 text-[#9E9689] hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[#642D3A]/30 text-[#9E9689] hover:text-[#F0E8D8] transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Title & Metadata */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F0E8D8] leading-tight">
              {memory.title}
            </h2>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#9E9689]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D6AD62]" />
                <span>{memory.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#D6AD62]" />
                <span>By {memory.author}</span>
                {memory.recipient && <span> (To: {memory.recipient})</span>}
              </div>
              {memory.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D6AD62]" />
                  <span>{memory.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Optional Photograph / Plate */}
          {memory.imageUrl && (
            <div className="rounded border border-[#D6AD62]/20 overflow-hidden bg-black/40">
              <img
                src={memory.imageUrl}
                alt={memory.imageAlt || memory.title}
                className="w-full max-h-[350px] object-contain object-center"
                referrerPolicy="no-referrer"
              />
              {memory.imageAlt && (
                <div className="p-2.5 text-[11px] text-[#9E9689] font-editorial italic text-center bg-[#131219]">
                  {memory.imageAlt}
                </div>
              )}
            </div>
          )}

          {/* Curatorial Description */}
          <div className="p-4 rounded bg-[#171520] border border-[#D6AD62]/15 space-y-1.5">
            <div className="text-[11px] font-semibold tracking-wider uppercase text-[#D6AD62]">Curatorial Summary</div>
            <p className="text-sm text-[#9E9689] font-editorial leading-relaxed">{memory.description}</p>
          </div>

          {/* Full Content / Transcript */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#D6AD62]">Archival Transcript</span>
              {memory.originalFileName && (
                <span className="text-[11px] font-mono-numbers text-[#9E9689]">Source: {memory.originalFileName}</span>
              )}
            </div>

            <div className="p-5 rounded bg-[#100F15] border border-[#D6AD62]/20 font-manuscript text-sm sm:text-base leading-relaxed text-[#F0E8D8] whitespace-pre-wrap selection:bg-[#642D3A]">
              {memory.content}
            </div>
          </div>

          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-[#9E9689]">
              <Tag className="w-3.5 h-3.5 text-[#D6AD62]" />
              {memory.tags.map((tag, idx) => (
                <span key={idx}>
                  #{tag}
                  {idx < memory.tags.length - 1 && <span className="ml-2 text-[#9E9689]/40">·</span>}
                </span>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-[#D6AD62]/15 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => {
                onClose();
                setActiveTab('ghost');
              }}
              className="px-4 py-2 text-xs font-semibold text-[#D6AD62] hover:text-[#F0E8D8] border border-[#D6AD62]/30 hover:border-[#D6AD62] rounded transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Weave into Ghost Story</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#9E9689] hover:text-[#F0E8D8] rounded transition-colors cursor-pointer"
            >
              Close Record
            </button>
          </div>
        </div>

        {/* Delete Confirmation Warning Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-[#0B0A0F]/95 backdrop-blur-md z-20 flex items-center justify-center p-6 text-center animate-in fade-in duration-150">
            <div className="max-w-md space-y-4">
              <div className="w-12 h-12 rounded-full border border-rose-500/40 bg-rose-950/30 text-rose-400 mx-auto flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F0E8D8]">Confirm Record Deletion</h3>
              <p className="text-sm text-[#9E9689] font-editorial">
                Are you certain you wish to remove "{memory.title}" from your permanent archive? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-xs text-[#9E9689] hover:text-[#F0E8D8] border border-[#D6AD62]/20 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded transition-colors cursor-pointer"
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
