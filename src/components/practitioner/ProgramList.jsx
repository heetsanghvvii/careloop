import React, { useState } from 'react';
import { 
  IconClipboardList, 
  IconPlus, 
  IconCopy, 
  IconEdit, 
  IconTrash, 
  IconCheckCircle, 
  IconSearch, 
  IconSparkles,
  IconClock,
  IconUsers
} from '../Icons.jsx';
import { CATEGORIES, DEFAULT_PROGRAM_TEMPLATES } from '../../data/programTemplates.js';

export const ProgramList = ({ 
  programs, 
  onOpenCreateModal, 
  onEditProgram, 
  onDuplicateProgram, 
  onDeleteProgram, 
  onOpenAssignModal,
  onCloneTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [previewProgram, setPreviewProgram] = useState(null);

  const activePrograms = programs.filter(p => !p.archived);

  const filteredPrograms = activePrograms.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8EAE7]">
        <div>
          <h2 className="text-xl font-extrabold text-[#18231C]">
            Program Library & Templates
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Build repeatable health curriculums, clone starter protocol templates, and assign task flows.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <IconPlus className="w-4 h-4" />
          Create Program
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconSearch className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search programs by title or description..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white shadow-xs"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs py-2 px-3 rounded-xl border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white font-medium text-gray-700 shadow-xs"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Active Workspace Programs Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#18231C]">
            Active Workspace Programs ({filteredPrograms.length})
          </h3>
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#D5D9D4] p-8">
            <IconClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[#18231C]">No programs found</h4>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your search filter or clone one of the pre-built templates below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrograms.map((prog) => (
              <div 
                key={prog.id}
                className="bg-white rounded-2xl border border-[#E8EAE7] p-5 shadow-xs flex flex-col justify-between hover:border-[#2D6A4F]/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EBF7EE] text-[#1B4332] border border-[#D8F3DC]">
                      {prog.category || 'General'}
                    </span>
                    <span className="text-[11px] text-gray-500 font-semibold flex items-center gap-1">
                      <IconClock className="w-3.5 h-3.5 text-gray-400" />
                      {prog.durationDays} Days
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#18231C] leading-snug">
                    {prog.title}
                  </h4>
                  <p className="text-xs text-[#5C6E63] mt-1.5 line-clamp-2 leading-relaxed">
                    {prog.description || 'No description provided.'}
                  </p>

                  {/* Tasks count preview */}
                  <div className="mt-4 pt-3 border-t border-[#F0F2EF]">
                    <div className="text-[11px] font-semibold text-gray-700 mb-2">
                      {prog.tasks?.length || 0} Daily Actions Configured:
                    </div>
                    <ul className="space-y-1">
                      {(prog.tasks || []).slice(0, 3).map((t, idx) => (
                        <li key={idx} className="text-[11px] text-gray-500 flex items-center gap-1.5 truncate">
                          <IconCheckCircle className="w-3 h-3 text-[#2D6A4F] shrink-0" />
                          <span className="truncate">{t.title}</span>
                        </li>
                      ))}
                      {(prog.tasks?.length || 0) > 3 && (
                        <li className="text-[10px] text-gray-400 pl-4 font-medium">
                          + {prog.tasks.length - 3} more actions
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-6 pt-4 border-t border-[#F0F2EF] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditProgram(prog)}
                      className="p-1.5 text-gray-500 hover:text-[#18231C] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit program"
                    >
                      <IconEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicateProgram(prog.id)}
                      className="p-1.5 text-gray-500 hover:text-[#18231C] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Duplicate program"
                    >
                      <IconCopy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProgram(prog.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Archive program"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenAssignModal(prog)}
                    className="px-3 py-1.5 rounded-lg bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] transition-colors shadow-xs flex items-center gap-1"
                  >
                    <IconUsers className="w-3.5 h-3.5" />
                    Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pre-built Starter Protocol Template Library */}
      <div className="pt-6 border-t border-[#E8EAE7]">
        <div className="flex items-center gap-2 mb-2">
          <IconSparkles className="w-4 h-4 text-[#2D6A4F]" />
          <h3 className="text-sm font-bold text-[#18231C]">
            Ready-to-Clone Template Library
          </h3>
        </div>
        <p className="text-xs text-gray-500 mb-5">
          Curated sample habit, nutrition, and recovery curriculum templates ready to import into your workspace in 1 click (examples only; customize to your professional scope).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEFAULT_PROGRAM_TEMPLATES.map((tmpl) => (
            <div 
              key={tmpl.id}
              className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8EAE7] flex flex-col justify-between hover:border-[#2D6A4F]/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold mb-1.5">
                  <span className="text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded">
                    {tmpl.category}
                  </span>
                  <span>{tmpl.durationDays}d</span>
                </div>
                <h4 className="font-bold text-xs text-[#18231C] leading-snug">
                  {tmpl.title}
                </h4>
                <p className="text-[11px] text-[#5C6E63] mt-1.5 line-clamp-3 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8EAE7]">
                <button
                  onClick={() => onCloneTemplate(tmpl)}
                  className="w-full py-2 rounded-lg bg-white border border-[#D5D9D4] text-xs font-semibold text-[#18231C] hover:bg-[#EBF7EE] hover:text-[#1B4332] hover:border-[#BDE8C6] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <IconCopy className="w-3.5 h-3.5" />
                  Clone Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
