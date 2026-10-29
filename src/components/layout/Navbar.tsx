import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Video, Sparkles, Check, Clock, Volume2, VolumeX, Flame } from 'lucide-react';
import { NavigationTab } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    snoozeTaskReminder,
    activeTab,
    setActiveTab,
    startCall,
    soundEnabled,
    setSoundEnabled,
    setIsRouletteOpen,
    setIsNewTaskModalOpen,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'tasks', label: 'My Tasks' },
    { id: 'groups', label: 'Groups' },
    { id: 'chat', label: 'Chat' },
    { id: 'calls', label: 'Calls' },
    { id: 'friends', label: 'Friends' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 text-left cursor-pointer whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-400 flex items-center justify-center text-white shadow-sm font-black text-base">
            TB
          </span>
          <span>TaskBuddies</span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navItems.slice(0, 5).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-1 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-orange-600 dark:text-orange-400 font-semibold border-b-2 border-orange-500'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Streak indicator */}
          <div
            title={`${currentUser.streakDays} day buddy streak!`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800/50"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-mono tabular-nums">{currentUser.streakDays}d streak</span>
          </div>

          {/* Random task roulette button */}
          <button
            onClick={() => setIsRouletteOpen(true)}
            title="Surprise me! Pick a random task"
            className="p-2 text-slate-600 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Notifications dropdown trigger */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {/* Dropdown menu */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 font-mono tabular-nums">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet. You’re all caught up! ✨
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 ${
                          !n.read ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-medium text-slate-900 dark:text-white">{n.title}</div>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                        {n.relatedTaskId && (
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                snoozeTaskReminder(n.relatedTaskId!, 15);
                              }}
                              className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded"
                            >
                              <Clock className="w-3 h-3" />
                              Snooze 15m
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Start Focus Call CTA */}
          <button
            onClick={() => startCall('Focus Hangout Room', 'video')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg hover:from-orange-600 hover:to-rose-600 shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Video className="w-4 h-4" />
            <span>Focus Call</span>
          </button>

          {/* Profile Avatar trigger */}
          <button
            onClick={() => setActiveTab('settings')}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 transition-colors cursor-pointer shrink-0"
            title={`${currentUser.displayName} (@${currentUser.username})`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
