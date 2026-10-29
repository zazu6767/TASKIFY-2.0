import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskCard } from '../tasks/TaskCard';
import {
  Users,
  Plus,
  Target,
  Award,
  Sparkles,
  Calendar,
  MessageSquare,
  X,
} from 'lucide-react';
import { GroupSpace } from '../../types';

export const GroupsView: React.FC = () => {
  const {
    groups,
    createGroup,
    tasks,
    buddies,
    currentUser,
    setSelectedTaskId,
    setActiveTab,
    setActiveChatConvId,
    setIsNewTaskModalOpen,
  } = useApp();

  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  // New Group Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [questTitle, setQuestTitle] = useState('');
  const [questTarget, setQuestTarget] = useState(10);
  const [questBadge, setQuestBadge] = useState('Sprint Star');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([currentUser.id]);

  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const groupTasks = tasks.filter((t) => t.groupId === activeGroup?.id);
  const completedGroupTasks = groupTasks.filter((t) => t.status === 'completed');

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createGroup({
      name: name.trim(),
      description: description.trim(),
      emoji,
      accentColor: '#f97316',
      memberIds: selectedMembers,
      quest: {
        title: questTitle.trim() || `${name} Squad Quest`,
        targetTasks: Number(questTarget) || 10,
        currentTasks: 0,
        rewardBadge: questBadge.trim() || 'Champion Badge',
        deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      },
    });

    setIsCreateGroupOpen(false);
    setName('');
    setDescription('');
  };

  const toggleMemberSelection = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Shared Spaces & Squad Quests
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Co-work on trips, projects, and goals with your friend circles.
          </p>
        </div>

        <button
          onClick={() => setIsCreateGroupOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Shared Space</span>
        </button>
      </div>

      {/* Group Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {groups.map((g) => {
          const isSelected = g.id === activeGroup?.id;
          const pct = Math.round((g.quest.currentTasks / g.quest.targetTasks) * 100);

          return (
            <div
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-orange-500 ring-2 ring-orange-500/20 shadow-sm'
                  : 'bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl p-2 bg-slate-50 dark:bg-slate-750 rounded-xl">
                  {g.emoji}
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-500 font-semibold">
                  {g.quest.currentTasks}/{g.quest.targetTasks} tasks
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3 truncate">
                {g.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {g.description}
              </p>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Space Detail View */}
      {activeGroup && (
        <div className="space-y-6">
          {/* Active Space Banner & Quest Card */}
          <div className="p-6 bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-rose-50/50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 rounded-2xl border border-orange-200/60 dark:border-slate-700 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-3 bg-white dark:bg-slate-750 rounded-2xl shadow-xs">
                  {activeGroup.emoji}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activeGroup.name}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {activeGroup.description}
                  </p>
                </div>
              </div>

              {/* Members Avatars & Chat Trigger */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  {activeGroup.memberIds.map((mId) => {
                    const member =
                      mId === currentUser.id
                        ? currentUser
                        : buddies.find((b) => b.id === mId);
                    if (!member) return null;
                    return (
                      <img
                        key={mId}
                        src={member.avatar}
                        alt={member.displayName}
                        title={member.displayName}
                        referrerPolicy="no-referrer"
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                      />
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setActiveChatConvId('conv_kyoto');
                    setActiveTab('chat');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                  <span>Space Chat</span>
                </button>
              </div>
            </div>

            {/* Quest Meter */}
            <div className="p-4 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-orange-200/50 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {activeGroup.quest.title}
                  </span>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  Reward: <strong className="text-orange-600">{activeGroup.quest.rewardBadge}</strong>
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (activeGroup.quest.currentTasks / activeGroup.quest.targetTasks) * 100
                    )}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{activeGroup.quest.currentTasks} tasks checked together</span>
                <span>Goal: {activeGroup.quest.targetTasks} tasks</span>
              </div>
            </div>
          </div>

          {/* Group Tasks List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Space Tasks ({groupTasks.length})
              </h3>
              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
              >
                + Add Task to this space
              </button>
            </div>

            {groupTasks.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500">No tasks in this shared space yet!</p>
                <button
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="mt-3 px-3.5 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Create first task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {groupTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={() => setSelectedTaskId(task.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create New Space Modal */}
      {isCreateGroupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-850 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create a Shared Space
              </h3>
              <button
                onClick={() => setIsCreateGroupOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Space Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kyoto Trip, Hackathon Squad, Reading Club"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this space for?"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Emoji Icon
                </label>
                <div className="flex gap-2">
                  {['⛩️', '🚀', '🌱', '🎨', '📚', '☕️', '🎮', '💡'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      className={`text-xl p-2 rounded-lg cursor-pointer ${
                        emoji === em ? 'bg-orange-100 ring-2 ring-orange-500' : 'hover:bg-slate-100 dark:hover:bg-slate-750'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quest Goal Title
                  </label>
                  <input
                    type="text"
                    value={questTitle}
                    onChange={(e) => setQuestTitle(e.target.value)}
                    placeholder="e.g. Complete 10 trip bookings"
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Tasks Count
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={50}
                    value={questTarget}
                    onChange={(e) => setQuestTarget(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Members checklist */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Add Buddies to Space
                </label>
                <div className="flex flex-wrap gap-2">
                  {buddies.map((buddy) => (
                    <button
                      key={buddy.id}
                      type="button"
                      onClick={() => toggleMemberSelection(buddy.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border cursor-pointer ${
                        selectedMembers.includes(buddy.id)
                          ? 'bg-orange-50 border-orange-400 text-orange-800 font-medium'
                          : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <img src={buddy.avatar} alt={buddy.displayName} className="w-4 h-4 rounded-full object-cover" />
                      <span>{buddy.displayName}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-750 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Create Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
