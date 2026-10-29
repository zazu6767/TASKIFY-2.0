import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, CheckSquare, Users, MessageSquare, PhoneCall } from 'lucide-react';
import { NavigationTab } from '../../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, conversations } = useApp();
  const unreadChat = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const items: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: unreadChat },
    { id: 'calls', label: 'Calls', icon: PhoneCall },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-1.5 px-3 rounded-lg text-xs font-medium transition-colors relative cursor-pointer ${
              isActive
                ? 'text-orange-600 dark:text-orange-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
