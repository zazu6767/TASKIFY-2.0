import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Video,
  Plus,
  Heart,
  Users,
  Target,
  Smile,
} from 'lucide-react';
import { TaskCard } from '../tasks/TaskCard';
import { TaskCompletionTrends } from './TaskCompletionTrends';

export const HomeDashboard: React.FC = () => {
  const {
    currentUser,
    tasks,
    groups,
    buddies,
    startCall,
    setActiveTab,
    setIsNewTaskModalOpen,
    setIsRouletteOpen,
    setSelectedTaskId,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr || t.status === 'in_progress');
  const pendingCount = tasks.filter((t) => t.status !== 'completed').length;
  const completedTodayCount = tasks.filter(
    (t) => t.status === 'completed' && t.completedAt?.startsWith(todayStr)
  ).length;

  const primaryGroup = groups[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 via-rose-50 to-amber-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-orange-200/60 dark:border-slate-700/80 p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <Smile className="w-4 h-4" />
              <span>Good day, {currentUser.displayName.split(' ')[0]}! Ready for today’s quest?</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Get things done together with your buddies.
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Organize shared plans, jump into quick focus sprints, and celebrate every checkmark. No stress, just good co-working energy.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add a Quest Task</span>
              </button>

              <button
                onClick={() => startCall('Focus Hangout Room', 'video')}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors cursor-pointer"
              >
                <Video className="w-4 h-4 text-orange-500" />
                <span>Start Focus Call</span>
              </button>

              <button
                onClick={() => setIsRouletteOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Random Task Picker</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5 hidden md:block">
            <div className="relative rounded-xl overflow-hidden shadow-md border border-white/60 dark:border-slate-700 max-h-56">
              <img
                src="/src/assets/images/hero_taskbuddies_hangout_1793258225615.jpg"
                alt="Friends hanging out and working happily"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[11px] text-white font-medium flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span>7-Day Co-work Streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Tasks</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono tabular-nums">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across all spaces</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Done Today</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono tabular-nums">
            {completedTodayCount}
          </div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">Great momentum! ✨</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Buddy Streak</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1 font-mono tabular-nums flex items-center gap-1">
            <span>{currentUser.streakDays}</span>
            <span className="text-sm font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-orange-600/80 mt-0.5">Keep the flame alive 🔥</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Spaces</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1 font-mono tabular-nums">
            {groups.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Collaborative squads</div>
        </div>
      </div>

      {/* Recharts Task Completion Trends (Past Month) */}
      <TaskCompletionTrends />

      {/* Main Content Grid: Today's Tasks + Buddy Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Today's Focus & Tasks */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Today’s Focus
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tasks due today or marked in progress
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                You’re all caught up for today!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Take a breather, hang out with a buddy, or pick a fun random quest from your wishlist.
              </p>
              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="mt-4 px-3.5 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Add another task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSelect={() => setSelectedTaskId(task.id)}
                />
              ))}
            </div>
          )}

          {/* Group Quest Highlight */}
          {primaryGroup && (
            <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{primaryGroup.emoji}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {primaryGroup.quest.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {primaryGroup.name} · Reward: {primaryGroup.quest.rewardBadge}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('groups')}
                  className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                >
                  Space details
                </button>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span>Quest progress</span>
                  <span className="font-mono tabular-nums">
                    {primaryGroup.quest.currentTasks} / {primaryGroup.quest.targetTasks} tasks (
                    {Math.round((primaryGroup.quest.currentTasks / primaryGroup.quest.targetTasks) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (primaryGroup.quest.currentTasks / primaryGroup.quest.targetTasks) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Buddies Active Focus & Co-working */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Buddy Co-work Hub
            </h2>
            <button
              onClick={() => setActiveTab('friends')}
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
            >
              All buddies
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60">
            {buddies.map((buddy) => (
              <div key={buddy.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={buddy.avatar}
                        alt={buddy.displayName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${
                          buddy.status === 'focusing'
                            ? 'bg-amber-500'
                            : buddy.status === 'online'
                            ? 'bg-emerald-500'
                            : 'bg-slate-400'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {buddy.displayName}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {buddy.status === 'focusing' ? 'Focusing silently 🎧' : buddy.status}
                      </div>
                    </div>
                  </div>

                  {/* Call invite button */}
                  <button
                    onClick={() => startCall(`Co-work with ${buddy.displayName}`, 'video', buddy.id)}
                    className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                    title={`Start focus call with ${buddy.displayName}`}
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>

                {buddy.currentFocusTask && (
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-750 rounded-lg text-xs text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Currently working on</span>
                    <span className="font-medium">{buddy.currentFocusTask}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Focus Sprint Prompt */}
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-850 rounded-xl border border-indigo-100 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>25-Minute Focus Sprint</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Set a timer, turn on ambient rain or cafe hum, and knock out one priority task in peace with buddies.
            </p>
            <button
              onClick={() => {
                setActiveTab('calls');
                startCall('Focus Sprint Room', 'video');
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Launch Focus Sprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
