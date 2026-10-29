import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskCard } from './TaskCard';
import { TaskItem, TaskCategory, TaskPriority } from '../../types';
import {
  Search,
  Filter,
  Plus,
  Sparkles,
  LayoutList,
  Kanban,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Inbox,
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const {
    tasks,
    setIsNewTaskModalOpen,
    setIsRouletteOpen,
    setSelectedTaskId,
    currentUser,
    groups,
    toggleTaskStatus,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'overdue'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<'all' | 'me' | 'others'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'timeline'>('list');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Status
      if (statusFilter === 'pending' && task.status !== 'pending') return false;
      if (statusFilter === 'in_progress' && task.status !== 'in_progress') return false;
      if (statusFilter === 'completed' && task.status !== 'completed') return false;
      if (statusFilter === 'overdue') {
        const isOverdue = task.status !== 'completed' && task.dueDate && task.dueDate < todayStr;
        if (!isOverdue) return false;
      }

      // Category
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

      // Priority
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Assignee
      if (assigneeFilter === 'me' && !task.assigneeIds.includes(currentUser.id)) return false;
      if (assigneeFilter === 'others' && task.assigneeIds.includes(currentUser.id) && task.assigneeIds.length === 1) return false;

      return true;
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter, priorityFilter, assigneeFilter, currentUser.id, todayStr]);

  // Board columns
  const pendingColumn = filteredTasks.filter((t) => t.status === 'pending');
  const inProgressColumn = filteredTasks.filter((t) => t.status === 'in_progress');
  const completedColumn = filteredTasks.filter((t) => t.status === 'completed');

  // Timeline groups (grouped by date)
  const timelineGroups = useMemo(() => {
    const map: Record<string, TaskItem[]> = {};
    filteredTasks.forEach((t) => {
      const dateKey = t.dueDate || 'No Due Date';
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(t);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredTasks]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Task Quests & Goals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize personal goals, shared squad quests, and habit streaks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsRouletteOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs font-semibold rounded-xl border border-amber-200/80 dark:border-amber-800/40 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Roulette</span>
          </button>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, descriptions, or categories..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-750 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Board view"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Timeline view"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Segmented Controls (interactive functional buttons, permitted by constitution) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-750 text-xs">
          {/* Status buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-750 rounded-lg">
            {(
              [
                { id: 'all', label: 'All Tasks' },
                { id: 'pending', label: 'Pending' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'completed', label: 'Done' },
                { id: 'overdue', label: 'Overdue' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === s.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
            <option value="Work">Work</option>
            <option value="Trip">Trip</option>
            <option value="Health">Health</option>
            <option value="Creative">Creative</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Assignee Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-750 rounded-lg">
            <button
              onClick={() => setAssigneeFilter('all')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                assigneeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Everyone
            </button>
            <button
              onClick={() => setAssigneeFilter('me')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                assigneeFilter === 'me'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Mine
            </button>
          </div>
        </div>
      </div>

      {/* Main Views */}
      {filteredTasks.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No matching tasks found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters, or click below to add a brand new quest!
          </p>
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-sm transition-colors"
          >
            Create Task
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSelect={() => setSelectedTaskId(task.id)}
            />
          ))}
        </div>
      ) : viewMode === 'board' ? (
        /* Board / Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending */}
          <div className="space-y-3 bg-slate-100/60 dark:bg-slate-850/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Pending Quests
              </span>
              <span className="text-xs font-mono tabular-nums text-slate-500 font-bold">
                {pendingColumn.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingColumn.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSelect={() => setSelectedTaskId(task.id)}
                />
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div className="space-y-3 bg-amber-50/50 dark:bg-slate-850/60 p-4 rounded-2xl border border-amber-200/50 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                In Progress ⚡️
              </span>
              <span className="text-xs font-mono tabular-nums text-amber-700 dark:text-amber-300 font-bold">
                {inProgressColumn.length}
              </span>
            </div>
            <div className="space-y-3">
              {inProgressColumn.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSelect={() => setSelectedTaskId(task.id)}
                />
              ))}
            </div>
          </div>

          {/* Completed */}
          <div className="space-y-3 bg-emerald-50/40 dark:bg-slate-850/60 p-4 rounded-2xl border border-emerald-200/50 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Completed 🎉
              </span>
              <span className="text-xs font-mono tabular-nums text-emerald-700 dark:text-emerald-300 font-bold">
                {completedColumn.length}
              </span>
            </div>
            <div className="space-y-3">
              {completedColumn.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSelect={() => setSelectedTaskId(task.id)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Timeline / Calendar View */
        <div className="space-y-6">
          {timelineGroups.map(([dateKey, tasksOnDate]) => (
            <div key={dateKey} className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                  {dateKey === todayStr ? 'Today (Due Date)' : dateKey}
                </h3>
                <span className="text-xs text-slate-400">({tasksOnDate.length} tasks)</span>
              </div>
              <div className="space-y-3 pl-6 border-l-2 border-orange-200 dark:border-slate-700">
                {tasksOnDate.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={() => setSelectedTaskId(task.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
