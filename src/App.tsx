/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { HomeDashboard } from './components/home/HomeDashboard';
import { TasksView } from './components/tasks/TasksView';
import { GroupsView } from './components/groups/GroupsView';
import { ChatView } from './components/chat/ChatView';
import { CallsView } from './components/calls/CallsView';
import { FriendsView } from './components/friends/FriendsView';
import { SettingsView } from './components/settings/SettingsView';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { TaskRouletteModal } from './components/tasks/TaskRouletteModal';
import { NewTaskModal } from './components/tasks/NewTaskModal';
import { IncomingCallModal } from './components/calls/IncomingCallModal';
import { PhoneCall, Clock } from 'lucide-react';

const MainAppLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedTaskId,
    setSelectedTaskId,
    isRouletteOpen,
    setIsRouletteOpen,
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    callState,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Bar Navigation */}
      <Navbar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar on Desktop */}
        <Sidebar />

        {/* Viewport Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {activeTab === 'home' && <HomeDashboard />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'groups' && <GroupsView />}
          {activeTab === 'chat' && <ChatView />}
          {activeTab === 'calls' && <CallsView />}
          {activeTab === 'friends' && <FriendsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Floating Active Call / Focus Sprint Bar if user leaves Calls tab */}
      {callState.isActive && activeTab !== 'calls' && (
        <div
          onClick={() => setActiveTab('calls')}
          className="fixed bottom-16 lg:bottom-6 right-6 z-40 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-all animate-bounce"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-xs">
            <span className="font-bold block">Active Focus Session</span>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
              {callState.participants.length} buddies in room · Tap to return
            </span>
          </div>
          <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>
      )}

      {/* Bottom Nav on Mobile */}
      <MobileNav />

      {/* Global Modals */}
      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}

      {isRouletteOpen && (
        <TaskRouletteModal onClose={() => setIsRouletteOpen(false)} />
      )}

      {isNewTaskModalOpen && (
        <NewTaskModal onClose={() => setIsNewTaskModalOpen(false)} />
      )}

      <IncomingCallModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
