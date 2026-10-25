import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal.jsx';
import { CATEGORIES } from '../../data/programTemplates.js';
import { IconPlus, IconTrash, IconClipboardList } from '../Icons.jsx';

export const ProgramBuilder = ({ 
  isOpen, 
  onClose, 
  initialProgram = null, 
  onSaveProgram 
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [durationDays, setDurationDays] = useState(21);
  const [description, setDescription] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      title: 'Morning Hydration & Sunlight',
      description: '500ml water and 15 mins outdoor sunlight exposure.',
      frequency: 'Daily',
      category: 'Habits',
      targetMetric: '500 ml'
    }
  ]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProgram) {
      setTitle(initialProgram.title || '');
      setCategory(initialProgram.category || CATEGORIES[0]);
      setDurationDays(initialProgram.durationDays || 21);
      setDescription(initialProgram.description || '');
      setGuidelines(initialProgram.guidelines || '');
      setTasks(initialProgram.tasks && initialProgram.tasks.length > 0 ? initialProgram.tasks : [
        {
          id: 'task-1',
          title: 'Morning Action',
          description: 'Daily anchor task',
          frequency: 'Daily',
          category: 'Habits',
          targetMetric: '1 session'
        }
      ]);
    } else {
      setTitle('');
      setCategory(CATEGORIES[0]);
      setDurationDays(21);
      setDescription('');
      setGuidelines('');
      setTasks([
        {
          id: 'task-1',
          title: 'Morning Routine Anchor',
          description: 'Daily consistency action to initiate circadian rhythm.',
          frequency: 'Daily',
          category: 'Habits',
          targetMetric: '15 mins'
        }
      ]);
    }
  }, [initialProgram, isOpen]);

  const handleAddTask = () => {
    const newTask = {
      id: 'task-' + Date.now(),
      title: '',
      description: '',
      frequency: 'Daily',
      category: 'General',
      targetMetric: ''
    };
    setTasks([...tasks, newTask]);
  };

  const handleRemoveTask = (idx) => {
    if (tasks.length === 1) {
      setError('A program must have at least one task definition.');
      return;
    }
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleTaskChange = (idx, field, value) => {
    const updated = [...tasks];
    updated[idx][field] = value;
    setTasks(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a program title.');
      return;
    }
    for (let i = 0; i < tasks.length; i++) {
      if (!tasks[i].title.trim()) {
        setError(`Task #${i + 1} is missing a title.`);
        return;
      }
    }

    onSaveProgram({
      id: initialProgram?.id,
      title: title.trim(),
      category,
      durationDays: Number(durationDays) || 21,
      description: description.trim(),
      guidelines: guidelines.trim(),
      tasks
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProgram ? 'Edit Health Program' : 'Create New Program Sequence'}
      subtitle="Design a structured daily adherence curriculum for your clients."
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* Basic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#18231C] mb-1">
              Program Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 21-Day Daily Habit Plan"
              className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18231C] mb-1">
              Duration (Days) *
            </label>
            <input
              type="number"
              min="3"
              max="365"
              required
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#18231C] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18231C] mb-1">
              Program Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Core transformation goal & scientific rationale"
              className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#18231C] mb-1">
            Participant Guidelines & Non-Adherence Instructions
          </label>
          <textarea
            rows={2}
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
            placeholder="e.g. Do not double up if a day is missed. Log skips honestly..."
            className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white"
          />
        </div>

        {/* Daily Tasks Builder */}
        <div className="pt-2 border-t border-[#F0F2EF]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#18231C]">
                Daily Task Definitions ({tasks.length})
              </h4>
              <p className="text-[11px] text-gray-400">
                These actions will appear on the participant's daily mobile checklist.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTask}
              className="text-xs text-[#2D6A4F] font-semibold flex items-center gap-1 hover:underline"
            >
              <IconPlus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {tasks.map((task, idx) => (
              <div 
                key={task.id || idx}
                className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E8EAE7] relative space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2D6A4F] text-[11px] bg-[#EBF7EE] px-2 py-0.5 rounded">
                    Action #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(idx)}
                    className="text-gray-400 hover:text-rose-600 transition-colors"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Task Title (e.g. McGill Big 3 Core Protocol)"
                      value={task.title}
                      onChange={(e) => handleTaskChange(idx, 'title', e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Frequency (Daily, 3x/week)"
                      value={task.frequency}
                      onChange={(e) => handleTaskChange(idx, 'frequency', e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Instructions / How-to execute"
                    value={task.description}
                    onChange={(e) => handleTaskChange(idx, 'description', e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Target Metric (e.g. 500ml, 3 sets x 10 reps)"
                    value={task.targetMetric}
                    onChange={(e) => handleTaskChange(idx, 'targetMetric', e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F0F2EF]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg hover:bg-[#1B4332] shadow-xs"
          >
            {initialProgram ? 'Save Changes' : 'Create Program'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
