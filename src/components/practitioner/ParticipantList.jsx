import React, { useState } from 'react';
import { 
  IconSearch, 
  IconFilter, 
  IconPlus, 
  IconUsers, 
  IconFlame, 
  IconAlertCircle,
  IconCheckCircle,
  IconChevronRight
} from '../Icons.jsx';
import { CATEGORIES } from '../../data/programTemplates.js';

export const ParticipantList = ({ 
  participants, 
  workspace, 
  onOpenAddModal, 
  onSelectParticipant 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const today = new Date().toISOString().split('T')[0];

  const filteredParticipants = participants.filter(p => {
    // Exclude archived unless explicitly needed
    if (p.archived) return false;

    // Search filter
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.currentProgramTitle && p.currentProgramTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Category filter
    if (categoryFilter !== 'all' && p.category !== categoryFilter) {
      return false;
    }

    // Status filter
    if (statusFilter === 'active' && p.enrollmentStatus !== 'active') return false;
    if (statusFilter === 'completed' && p.enrollmentStatus !== 'completed') return false;
    if (statusFilter === 'needs_attention') {
      const isLowRate = p.completionRate < 60;
      let isInactive = false;
      if (p.lastActivityDate) {
        const daysDiff = Math.floor((new Date(today) - new Date(p.lastActivityDate)) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 3) isInactive = true;
      }
      return isLowRate || isInactive;
    }

    return true;
  });

  const planLimits = { Starter: 25, Growth: 100, Scale: 300 };
  const currentLimit = planLimits[workspace?.plan || 'Starter'] || 25;
  const activeCount = participants.filter(p => p.enrollmentStatus === 'active' && !p.archived).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8EAE7]">
        <div>
          <h2 className="text-xl font-extrabold text-[#18231C]">
            Participant Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage client enrollments, track program adherence, and configure individual coaching actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-right hidden sm:block">
            <span className="font-semibold text-gray-700">{activeCount} / {currentLimit}</span>
            <span className="text-gray-400 block text-[10px]">Active ({workspace?.plan} plan)</span>
          </div>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] transition-colors shadow-xs flex items-center gap-2"
          >
            <IconPlus className="w-4 h-4" />
            Add Participant
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <IconSearch className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search participants by name, email, or assigned program..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent bg-white shadow-xs"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white font-medium text-gray-700 shadow-xs"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="needs_attention">Needs Attention (At Risk)</option>
            <option value="completed">Completed</option>
          </select>

          {/* Category Filter */}
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
      </div>

      {/* Participant Cards / Table */}
      {filteredParticipants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#D5D9D4] p-8">
          <div className="w-12 h-12 rounded-full bg-[#EBF7EE] text-[#2D6A4F] flex items-center justify-center mx-auto mb-3">
            <IconUsers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#18231C]">No participants found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search criteria or clearing active filters.'
              : 'Enroll your first participant to begin assigning programs and tracking daily habits.'}
          </p>
          {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="mt-4 px-3 py-1.5 text-xs font-semibold text-[#2D6A4F] hover:underline"
            >
              Reset Filters
            </button>
          ) : (
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg hover:bg-[#1B4332]"
            >
              Add Participant
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8EAE7] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] border-b border-[#E8EAE7] text-gray-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Participant</th>
                  <th className="py-3.5 px-4 font-semibold">Program</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Adherence</th>
                  <th className="py-3.5 px-4 font-semibold">Streak</th>
                  <th className="py-3.5 px-4 font-semibold">Last Activity</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F2EF]">
                {filteredParticipants.map((p) => {
                  const daysSinceActivity = p.lastActivityDate ? Math.floor((new Date(today) - new Date(p.lastActivityDate)) / (1000 * 60 * 60 * 24)) : 0;
                  // Do not flag brand-new (Day 1) clients with no chance to complete yet, and never flag completed enrollments.
                  const isNeedsAttention = p.enrollmentStatus !== 'completed' && (p.currentDay || 1) > 1 && (p.completionRate < 60 || daysSinceActivity >= 3);

                  return (
                    <tr 
                      key={p.id}
                      onClick={() => onSelectParticipant(p)}
                      className="hover:bg-[#FAFAF8] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#18231C] text-sm group-hover:text-[#2D6A4F] transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-gray-400 font-normal">
                          {p.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-700 max-w-[200px] truncate font-medium">
                        {p.currentProgramTitle || (
                          <span className="text-gray-400 italic">No program</span>
                        )}
                        <span className="block text-[10px] text-gray-400 font-normal">
                          Day {p.currentDay || 1} of {p.totalDays || 21}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-medium">
                          {p.category || 'General'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.enrollmentStatus === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          p.enrollmentStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {p.enrollmentStatus}
                        </span>
                        {isNeedsAttention && (
                          <span className="ml-1.5 inline-block text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            At Risk
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs ${
                            p.completionRate >= 80 ? 'text-emerald-700' :
                            p.completionRate >= 60 ? 'text-amber-700' : 'text-rose-700'
                          }`}>
                            {p.completionRate}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-semibold text-gray-700">
                          <IconFlame className={`w-4 h-4 ${p.streakDays > 0 ? 'text-amber-500' : 'text-gray-300'}`} />
                          <span>{p.streakDays || 0}d</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {p.lastActivityDate || 'Never'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="text-[#2D6A4F] font-semibold text-xs inline-flex items-center gap-0.5 group-hover:underline">
                          View Profile
                          <IconChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
