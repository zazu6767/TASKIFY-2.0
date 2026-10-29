import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Calendar, Clock, AlertCircle } from 'lucide-react';
import { TaskCategory, TaskPriority } from '../../types';

interface NewTaskModalProps {
  onClose: () => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ onClose }) => {
  const { createTask, groups, buddies, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('18:00');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('Personal');
  const [groupId, setGroupId] = useState<string>('');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly'>('none');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([currentUser.id]);
  const [checklistItems, setChecklistItems] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [stepInput, setStepInput] = useState('');

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepInput.trim()) return;
    setChecklistItems((prev) => [
      ...prev,
      { id: `cl_${Date.now()}`, text: stepInput.trim(), completed: false },
    ]);
    setStepInput('');
  };

  const handleRemoveStep = (id: string) => {
    setChecklistItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      dueTime,
      priority,
      category,
      groupId: groupId || undefined,
      recurring,
      checklist: checklistItems,
      assigneeIds: selectedAssignees.length > 0 ? selectedAssignees : [currentUser.id],
      status: 'pending',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-850 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-750 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Create a New Quest Task
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Research Machiya guesthouse in Kyoto"
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, links, or notes for your buddies..."
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Category & Space */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Trip">Trip</option>
                <option value="Health">Health</option>
                <option value="Creative">Creative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shared Space / Group
              </label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="">Personal (No group)</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.emoji} {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority & Recurring */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
                {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                      priority === p
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Repeat / Habit
              </label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value as 'none' | 'daily' | 'weekly')}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily Habit</option>
                <option value="weekly">Weekly Recurring</option>
              </select>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Assign to Buddies
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleAssignee(currentUser.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
                  selectedAssignees.includes(currentUser.id)
                    ? 'bg-orange-50 border-orange-300 text-orange-800 dark:bg-orange-950/60 dark:text-orange-200'
                    : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                <img src={currentUser.avatar} alt="You" className="w-4 h-4 rounded-full object-cover" />
                <span>You</span>
              </button>

              {buddies.map((buddy) => {
                const isSelected = selectedAssignees.includes(buddy.id);
                return (
                  <button
                    key={buddy.id}
                    type="button"
                    onClick={() => toggleAssignee(buddy.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50 border-orange-300 text-orange-800 dark:bg-orange-950/60 dark:text-orange-200'
                        : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                    }`}
                  >
                    <img src={buddy.avatar} alt={buddy.displayName} className="w-4 h-4 rounded-full object-cover" />
                    <span>{buddy.displayName.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checklist Steps */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Checklist Steps
            </label>
            <div className="space-y-1 mb-2">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <span className="text-slate-800 dark:text-slate-200">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(item.id)}
                    className="text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                placeholder="Add sub-step..."
                className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
              >
                Add Step
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-750 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Create Quest Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
