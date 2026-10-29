import React, { useState, useRef } from 'react';
import { MemoryItem, Category } from '../types/archive';
import { useArchive } from '../context/ArchiveContext';
import { X, Upload, FileText, AlertCircle, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMemory?: MemoryItem | null;
}

const CATEGORIES: Category[] = [
  'Letters',
  'Journals',
  'Family Stories',
  'Historical Documents',
  'Photographs',
  'Folklore',
  'Other',
];

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose, editMemory }) => {
  const { addMemory, updateMemory } = useArchive();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(editMemory?.title || '');
  const [date, setDate] = useState(editMemory?.date || '');
  const [category, setCategory] = useState<Category>(editMemory?.category || 'Letters');
  const [author, setAuthor] = useState(editMemory?.author || '');
  const [recipient, setRecipient] = useState(editMemory?.recipient || '');
  const [location, setLocation] = useState(editMemory?.location || '');
  const [description, setDescription] = useState(editMemory?.description || '');
  const [content, setContent] = useState(editMemory?.content || '');
  const [tagsInput, setTagsInput] = useState(editMemory?.tags?.join(', ') || '');
  const [imageUrl, setImageUrl] = useState(editMemory?.imageUrl || '');

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionMessage, setExtractionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtractionMessage(null);
    setValidationError(null);
    setIsExtracting(true);

    const allowedExtensions = ['.txt', '.md', '.markdown', '.pdf', '.jpg', '.jpeg', '.png', '.webp'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      setIsExtracting(false);
      setExtractionMessage({
        type: 'error',
        text: `Unsupported format "${fileExt}". Supported archival formats: TXT, Markdown (.md), PDF, and images (JPG, PNG, WebP).`,
      });
      return;
    }

    try {
      // For plain text & markdown, read in browser first
      if (file.type.includes('text') || fileExt === '.txt' || fileExt === '.md') {
        const text = await file.text();
        setContent(text);

        // Autofill title if empty
        if (!title) {
          const autoTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
          setTitle(autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1));
        }

        // Autofill description
        if (!description) {
          const preview = text.slice(0, 150).replace(/[\r\n]+/g, ' ').trim();
          setDescription(preview ? `${preview}...` : 'Archival transcript imported from text file.');
        }

        setExtractionMessage({
          type: 'success',
          text: `Successfully ingested "${file.name}" (${(file.size / 1024).toFixed(1)} KB).`,
        });
      } else if (file.type.startsWith('image/')) {
        // Image reading as base64 for preview / OCR
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Data = reader.result as string;
          setImageUrl(base64Data);

          // Request backend OCR extraction
          try {
            const res = await fetch('/api/extract-text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                base64Data,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (data.extractedText) {
                setContent(data.extractedText);
                setExtractionMessage({
                  type: 'success',
                  text: `Image "${file.name}" analyzed. Optical transcription populated into content.`,
                });
              } else {
                setContent(`[Visual Archival Photograph: ${file.name}]`);
                setExtractionMessage({
                  type: 'success',
                  text: `Image registered. Visual preview attached to record.`,
                });
              }
            }
          } catch (err) {
            setExtractionMessage({
              type: 'success',
              text: `Image attached. You may enter transcript or notes manually.`,
            });
          }
        };
        reader.readAsDataURL(file);
      } else {
        // PDF or binary
        const res = await fetch('/api/extract-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
        });
        const data = await res.json();
        setContent(data.extractedText || `[Document registered: ${file.name}]`);
        setExtractionMessage({
          type: 'success',
          text: `File "${file.name}" registered in archive registry.`,
        });
      }
    } catch (err: any) {
      setExtractionMessage({
        type: 'error',
        text: `Extraction error: ${err.message || 'Could not process file'}.`,
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Please provide a record title.');
      return;
    }

    if (!date.trim()) {
      setValidationError('Please enter a historical date (e.g. "October 14, 1912" or "Circa 1890").');
      return;
    }

    if (!content.trim()) {
      setValidationError('Please provide the transcript, letter body, or archival content.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    if (editMemory) {
      updateMemory(editMemory.id, {
        title: title.trim(),
        date: date.trim(),
        category,
        author: author.trim() || 'Unknown Chronicler',
        recipient: recipient.trim() || undefined,
        location: location.trim() || undefined,
        description: description.trim() || title.trim(),
        content: content.trim(),
        tags: tags.length > 0 ? tags : ['Archival'],
        imageUrl: imageUrl.trim() || undefined,
      });
    } else {
      addMemory({
        title: title.trim(),
        date: date.trim(),
        category,
        author: author.trim() || 'Unknown Chronicler',
        recipient: recipient.trim() || undefined,
        location: location.trim() || undefined,
        description: description.trim() || title.trim(),
        content: content.trim(),
        tags: tags.length > 0 ? tags : ['Archival'],
        imageUrl: imageUrl.trim() || undefined,
        originalFileName: fileInputRef.current?.files?.[0]?.name,
        fileType: fileInputRef.current?.files?.[0]?.type || 'text/plain',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-[#14121A] border border-[#D6AD62]/30 rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#F0E8D8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D6AD62]/20 bg-[#171520]">
          <div>
            <h3 className="font-title text-lg font-bold text-[#F0E8D8]">
              {editMemory ? 'Edit Archival Record' : 'Deposit Memory into Vault'}
            </h3>
            <p className="text-xs text-[#9E9689] font-editorial">
              {editMemory ? 'Update accession metadata and transcription' : 'Upload old letters, diaries, documents, or register manually'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#642D3A]/30 text-[#9E9689] hover:text-[#F0E8D8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {/* File Upload Zone */}
          {!editMemory && (
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-[#D6AD62] block">
                Extract from Document / Photograph (Optional)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-[#D6AD62]/30 hover:border-[#D6AD62] rounded-lg p-5 text-center cursor-pointer bg-[#100F15] transition-colors group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.markdown,.pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {isExtracting ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-[#D6AD62]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing document transcript...</span>
                  </div>
                ) : (
                  <div className="space-y-1 text-xs text-[#9E9689]">
                    <Upload className="w-6 h-6 mx-auto text-[#D6AD62] group-hover:scale-110 transition-transform mb-1.5" />
                    <div className="font-semibold text-[#F0E8D8]">Click to upload archival file</div>
                    <div>Supports TXT, Markdown (.md), PDF, and Images (JPG, PNG, WebP)</div>
                  </div>
                )}
              </div>

              {extractionMessage && (
                <div
                  className={`text-xs p-3 rounded flex items-start gap-2 ${
                    extractionMessage.type === 'success'
                      ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/40'
                      : 'bg-rose-950/30 text-rose-300 border border-rose-800/40'
                  }`}
                >
                  {extractionMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{extractionMessage.text}</span>
                </div>
              )}
            </div>
          )}

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3 rounded bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Core Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[#D6AD62] uppercase tracking-wider">
                Title / Subject *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Letter from London to Eleanor at Blackwood"
                className="w-full px-3.5 py-2.5 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-sm text-[#F0E8D8]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D6AD62] uppercase tracking-wider">
                Historical Date *
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. October 14, 1912 or Winter 1888"
                className="w-full px-3.5 py-2.5 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-sm text-[#F0E8D8]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D6AD62] uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-sm text-[#F0E8D8] cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#14121A]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D6AD62] uppercase tracking-wider">
                Author / Chronicler
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Arthur Pendelton or Reverend Wright"
                className="w-full px-3.5 py-2.5 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-sm text-[#F0E8D8]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D6AD62] uppercase tracking-wider">
                Location / Provenance
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Oakhaven Vale, Yorkshire"
                className="w-full px-3.5 py-2.5 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-sm text-[#F0E8D8]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D6AD62] uppercase tracking-wider">
              Curatorial Summary / Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief context regarding physical condition, provenance, or notes..."
              className="w-full px-3.5 py-2 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-sm text-[#F0E8D8] font-editorial resize-none"
            />
          </div>

          {/* Full Content / Transcript */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D6AD62] uppercase tracking-wider">
              Archival Transcript / Full Text *
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Full transcribed text of the letter, diary entry, oral account, or document..."
              className="w-full px-3.5 py-2.5 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-sm text-[#F0E8D8] font-manuscript"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D6AD62] uppercase tracking-wider">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Maritime, Devon, Winter, Solstice"
              className="w-full px-3.5 py-2.5 rounded bg-[#100F15] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-sm text-[#F0E8D8]"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#D6AD62]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#9E9689] hover:text-[#F0E8D8] border border-[#D6AD62]/20 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#0B0A0F] bg-[#D6AD62] hover:bg-[#E5BE72] rounded transition-colors shadow-md cursor-pointer"
            >
              {editMemory ? 'Save Record Changes' : 'Deposit into Archive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
