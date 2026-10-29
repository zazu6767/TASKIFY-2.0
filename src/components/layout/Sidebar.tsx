import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  CheckSquare,
  Users,
  MessageSquare,
  PhoneCall,
  UserCheck,
  Settings,
  Plus,
  Sparkles,
  PhoneIncoming,
  Circle,
} from 'lucide-react';
import { NavigationTab } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    groups,
    buddies,
    setIsNewTaskModalOpen,
    setIsRouletteOpen,
    triggerSimulatedIncomingCall,
    notifications,
    conversations,
  } = useApp();

  const totalUnreadChat = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'groups', label: 'Groups & Quests', icon: Users },
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: totalUnreadChat },
    { id: 'calls', label: 'Calls & Focus', icon: PhoneCall },
    { id: 'friends', label: 'Friends', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-4 space-y-6">
      
      {/* Primary Action Button */}
      <button
        onClick={() => setIsNewTaskModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Create Task</span>
      </button>

      {/* Primary Navigation Menu */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-mono tabular-nums">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Shared Spaces Quick List */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Shared Spaces
          </span>
          <button
            onClick={() => setActiveTab('groups')}
            className="text-xs text-orange-600 hover:underline cursor-pointer"
          >
            View all
          </button>
        </div>
        <div className="space-y-1">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveTab('groups')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer group"
            >
              <span className="flex items-center gap-2 truncate">
                <span>{group.emoji}</span>
                <span className="truncate">{group.name}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tabular-nums shrink-0">
                {group.quest.currentTasks}/{group.quest.targetTasks}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Online Buddies Live Focus */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex-1">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Buddies Focus
          </span>
          <button
            onClick={() => setActiveTab('friends')}
            className="text-xs text-orange-600 hover:underline cursor-pointer"
          >
            Manage
          </button>
        </div>
        <div className="space-y-2">
          {buddies.slice(0, 3).map((buddy) => (
            <div
              key={buddy.id}
              onClick={() => setActiveTab('friends')}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={buddy.avatar}
                    alt={buddy.displayName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${
                      buddy.status === 'focusing'
                        ? 'bg-amber-500'
                        : buddy.status === 'online'
                        ? 'bg-emerald-500'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                    {buddy.displayName}
                  </p>
                  {buddy.currentFocusTask && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {buddy.currentFocusTask}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Quick Playground Controls */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          onClick={() => setIsRouletteOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/50 rounded-xl transition-colors cursor-pointer border border-amber-200/60 dark:border-amber-800/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Task Roulette Wheel</span>
        </button>

        <button
          onClick={triggerSimulatedIncomingCall}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-xl transition-colors cursor-pointer"
          title="Simulate Maya calling you to test ringtone and answering UI"
        >
          <PhoneIncoming className="w-3.5 h-3.5 text-emerald-500" />
          <span>Simulate Incoming Call</span>
        </button>
      </div>
    </aside>
  );
};
