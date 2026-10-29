import React, { useState, useMemo } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { MemoryItem, Category } from '../types/archive';
import { MemoryDetailModal } from './MemoryDetailModal';
import { AddMemoryModal } from './AddMemoryModal';
import { 
  Search, Plus, Download, RefreshCw, Trash2, Calendar, 
  MapPin, User, FileText, Filter, ArrowUpDown, Sparkles, BookOpen
} from 'lucide-react';

const CATEGORIES: Array<Category | 'All'> = [
  'All',
  'Letters',
  'Journals',
  'Family Stories',
  'Historical Documents',
  'Photographs',
  'Folklore',
  'Other',
];

export const VaultPage: React.FC = () => {
  const { 
    memories, 
    selectedMemory, 
    setSelectedMemory, 
    restoreSampleRecords, 
    purgeAllRecords, 
    exportArchiveJSON, 
    exportArchiveMarkdown,
    setActiveTab 
  } = useArchive();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'year-desc' | 'year-asc' | 'title'>('year-asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memoryToEdit, setMemoryToEdit] = useState<MemoryItem | null>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  // Filter and sort memories
  const filteredMemories = useMemo(() => {
    return memories
      .filter((item) => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        if (!matchesCategory) return false;

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q) ||
          (item.location && item.location.toLowerCase().includes(q)) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortOrder === 'title') {
          return a.title.localeCompare(b.title);
        }
        const yearA = a.year || (a.date.match(/\d{4}/) ? parseInt(a.date.match(/\d{4}/)![0], 10) : 0);
        const yearB = b.year || (b.date.match(/\d{4}/) ? parseInt(b.date.match(/\d{4}/)![0], 10) : 0);
        return sortOrder === 'year-desc' ? yearB - yearA : yearA - yearB;
      });
  }, [memories, searchQuery, selectedCategory, sortOrder]);

  const handleEdit = (mem: MemoryItem) => {
    setMemoryToEdit(mem);
    setSelectedMemory(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D6AD62]/20">
        <div>
          <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#D6AD62]">
            <span>Archival Repository</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers">{memories.length} Inscribed Documents</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F0E8D8] tracking-tight mt-1">
            The Memory Vault
          </h1>
          <p className="text-sm text-[#9E9689] font-editorial mt-1 max-w-2xl">
            Examine manuscripts, photographs, and oral histories. Search by keyword or filter by curatorial classification.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setMemoryToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0B0A0F] bg-[#D6AD62] hover:bg-[#E5BE72] rounded transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Deposit Record</span>
          </button>

          <div className="relative group">
            <button
              className="px-3.5 py-2 text-xs font-medium text-[#F0E8D8] hover:text-[#D6AD62] border border-[#D6AD62]/30 hover:border-[#D6AD62] rounded bg-[#131219] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#161521] border border-[#D6AD62]/30 rounded-lg shadow-xl py-1.5 hidden group-hover:block z-30">
              <button
                onClick={exportArchiveJSON}
                className="w-full text-left px-3.5 py-2 text-xs text-[#F0E8D8] hover:bg-[#642D3A]/30 transition-colors flex items-center justify-between"
              >
                <span>Export as JSON</span>
                <span className="text-[10px] font-mono-numbers text-[#D6AD62]">.json</span>
              </button>
              <button
                onClick={exportArchiveMarkdown}
                className="w-full text-left px-3.5 py-2 text-xs text-[#F0E8D8] hover:bg-[#642D3A]/30 transition-colors flex items-center justify-between"
              >
                <span>Export as Markdown</span>
                <span className="text-[10px] font-mono-numbers text-[#D6AD62]">.md</span>
              </button>
            </div>
          </div>

          <button
            onClick={restoreSampleRecords}
            title="Restore default sample records for hackathon evaluation"
            className="p-2 text-xs text-[#9E9689] hover:text-[#D6AD62] border border-[#D6AD62]/20 rounded bg-[#131219] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {memories.length > 0 && (
            <button
              onClick={() => setShowPurgeConfirm(true)}
              title="Purge all records to start with an empty archive"
              className="p-2 text-xs text-[#9E9689] hover:text-rose-400 border border-[#D6AD62]/20 rounded bg-[#131219] transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9689]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, person, location, tag, or transcript excerpt..."
              className="w-full pl-10 pr-4 py-2.5 rounded bg-[#131219] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-sm text-[#F0E8D8] placeholder-[#9E9689]/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E9689] hover:text-[#F0E8D8]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#D6AD62] shrink-0" />
            <select
              value={sortOrder}
              onChange={(e: any) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-[#131219] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-xs text-[#F0E8D8] cursor-pointer"
            >
              <option value="year-asc" className="bg-[#131219]">Chronological (Oldest First)</option>
              <option value="year-desc" className="bg-[#131219]">Reverse Chronological (Newest)</option>
              <option value="title" className="bg-[#131219]">Alphabetical by Title</option>
            </select>
          </div>
        </div>

        {/* Category Tabs (Functional Segmented Control) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer font-medium ${
                  isActive
                    ? 'bg-[#D6AD62] text-[#0B0A0F] font-semibold shadow-sm'
                    : 'bg-[#131219] text-[#9E9689] hover:text-[#F0E8D8] border border-[#D6AD62]/15'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Memory Cards */}
      {filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMemory(item)}
              className="group p-5 rounded-lg bg-[#131219] border border-[#D6AD62]/20 hover:border-[#D6AD62]/60 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Visual Thumbnail if attached */}
                {item.imageUrl && (
                  <div className="relative h-40 rounded overflow-hidden border border-[#D6AD62]/15 bg-black/50 mb-3">
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt || item.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131219] via-transparent to-transparent opacity-60" />
                  </div>
                )}

                {/* Metadata Row: Zero-Pill Unboxed Text */}
                <div className="flex items-center gap-2 text-xs text-[#9E9689]">
                  <span className="font-mono-numbers text-[#D6AD62]">{item.accessionNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.date}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#F0E8D8] group-hover:text-[#D6AD62] transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#9E9689] font-editorial line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-5 pt-3 border-t border-[#D6AD62]/10 flex items-center justify-between text-[11px] text-[#9E9689]">
                <div className="truncate max-w-[200px]">
                  <span>By {item.author}</span>
                  {item.location && <span> · {item.location}</span>}
                </div>
                <span className="text-[#D6AD62] font-medium group-hover:underline">
                  Read Record →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-6 rounded-xl bg-[#131219] border border-[#D6AD62]/20 space-y-5 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full border border-[#D6AD62]/30 bg-[#642D3A]/20 flex items-center justify-center text-[#D6AD62] mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[#F0E8D8]">The Archive Stacks Lie Empty</h3>
            <p className="text-sm text-[#9E9689] font-editorial">
              {searchQuery || selectedCategory !== 'All'
                ? 'No documents matched your curatorial filter. Try clearing your search parameters.'
                : 'No memories have been deposited yet. Begin by uploading a historical document or restore the 5 hackathon sample records.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {searchQuery || selectedCategory !== 'All' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 text-xs font-semibold text-[#0B0A0F] bg-[#D6AD62] hover:bg-[#E5BE72] rounded transition-colors cursor-pointer"
              >
                Reset Search Filters
              </button>
            ) : (
              <>
                <button
                  onClick={restoreSampleRecords}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0B0A0F] bg-[#D6AD62] hover:bg-[#E5BE72] rounded transition-colors cursor-pointer"
                >
                  Restore Sample Archive (5 Demo Records)
                </button>
                <button
                  onClick={() => {
                    setMemoryToEdit(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-[#F0E8D8] hover:text-[#D6AD62] border border-[#D6AD62]/30 hover:border-[#D6AD62] rounded transition-colors cursor-pointer"
                >
                  Deposit First Memory
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onEdit={handleEdit}
        />
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <AddMemoryModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setMemoryToEdit(null);
          }}
          editMemory={memoryToEdit}
        />
      )}

      {/* Purge All Records Confirmation */}
      {showPurgeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14121A] border border-rose-500/40 rounded-lg p-6 max-w-md space-y-4 text-center">
            <h3 className="text-xl font-bold text-[#F0E8D8]">Purge Complete Archive?</h3>
            <p className="text-xs text-[#9E9689] font-editorial">
              This will permanently remove all {memories.length} stored memories from your browser. You can always restore the demo records afterward.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowPurgeConfirm(false)}
                className="px-4 py-2 text-xs text-[#9E9689] hover:text-[#F0E8D8] border border-[#D6AD62]/20 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  purgeAllRecords();
                  setShowPurgeConfirm(false);
                }}
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
