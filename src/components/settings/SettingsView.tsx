import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Palette,
  Bell,
  Shield,
  Volume2,
  Check,
  Save,
  Moon,
  Sun,
  Smile,
  Flame,
} from 'lucide-react';
import { ThemeType, UserStatus } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
  } = useApp();

  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [status, setStatus] = useState<UserStatus>(currentUser.status);
  const [currentFocusTask, setCurrentFocusTask] = useState(currentUser.currentFocusTask || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar);
  const [visibility, setVisibility] = useState(currentUser.visibility);

  // Notification prefs
  const [dueReminders, setDueReminders] = useState(currentUser.notificationPrefs.dueReminders);
  const [assignments, setAssignments] = useState(currentUser.notificationPrefs.assignments);
  const [chatMentions, setChatMentions] = useState(currentUser.notificationPrefs.chatMentions);
  const [calls, setCalls] = useState(currentUser.notificationPrefs.calls);
  const [quietHours, setQuietHours] = useState(currentUser.notificationPrefs.quietHours);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const avatarOptions = [
    { label: 'Samira', url: '/src/assets/images/avatar_buddy_sam_1793258226361.jpg' },
    { label: 'Maya', url: '/src/assets/images/avatar_buddy_maya_1793258226388.jpg' },
    { label: 'Leo', url: '/src/assets/images/avatar_buddy_leo_1793258226963.jpg' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      displayName: displayName.trim(),
      username: username.trim(),
      bio: bio.trim(),
      status,
      currentFocusTask: currentFocusTask.trim(),
      avatar: selectedAvatar,
      visibility,
      notificationPrefs: {
        dueReminders,
        assignments,
        chatMentions,
        calls,
        sound: soundEnabled,
        quietHours,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const themes: { id: ThemeType; name: string; color: string; desc: string }[] = [
    { id: 'sunset', name: 'Sunset Bloom', color: '#f97316', desc: 'Warm coral, terracotta, and soft cream' },
    { id: 'mint', name: 'Mint Meadow', color: '#10b981', desc: 'Fresh mint leaf and turquoise breeze' },
    { id: 'lavender', name: 'Lavender Dream', color: '#8b5cf6', desc: 'Playful lilac, soft violet, and pink' },
    { id: 'sunny', name: 'Sunny Honey', color: '#f59e0b', desc: 'Golden amber, warm sunshine, and honey' },
    { id: 'dark', name: 'Pastel Slate Dark', color: '#38bdf8', desc: 'Deep cozy night slate with pastel glow' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Personalize your buddy profile, notification controls, and cheerful themes.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Profile & Status */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-750 pb-3">
            <User className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Profile & Co-Work Status
            </h2>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Choose Avatar
            </label>
            <div className="flex items-center gap-4">
              {avatarOptions.map((opt) => (
                <button
                  key={opt.url}
                  type="button"
                  onClick={() => setSelectedAvatar(opt.url)}
                  className={`relative p-1 rounded-full cursor-pointer transition-transform ${
                    selectedAvatar === opt.url
                      ? 'ring-3 ring-orange-500 scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={opt.url}
                    alt={opt.label}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {selectedAvatar === opt.url && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username / Handle
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Bio & Focus Vibe
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          {/* Status & Current Focus Task */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Buddy Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="online">🟢 Online & Ready to chat</option>
                <option value="focusing">🎧 Focusing Silently (Do Not Disturb)</option>
                <option value="away">🟡 Stepped Away / Coffee Break</option>
                <option value="offline">⚪️ Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Focus Quest (Shown to Buddies)
              </label>
              <input
                type="text"
                value={currentFocusTask}
                onChange={(e) => setCurrentFocusTask(e.target.value)}
                placeholder="e.g. Drafting Kyoto itinerary"
                className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Cosmetic Theme Chooser */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-750 pb-3">
            <Palette className="w-4 h-4 text-purple-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Cosmetic Themes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {themes.map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/30 dark:bg-slate-750'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    {isActive && (
                      <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Notification & Sound Controls */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-750 pb-3">
            <Bell className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Notifications & Soundscapes
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-750 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Task Due Date Reminders
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Notify me when personal or squad tasks approach their due date
                </span>
              </div>
              <input
                type="checkbox"
                checked={dueReminders}
                onChange={(e) => setDueReminders(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-750 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Buddy Assignments & Cheers
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Get notified when a friend assigns a task or cheers with ❤️ / 🔥
                </span>
              </div>
              <input
                type="checkbox"
                checked={assignments}
                onChange={(e) => setAssignments(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-750 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Chat Mentions & Focus Call Invites
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ring when friends start a co-working call or mention you in chat
                </span>
              </div>
              <input
                type="checkbox"
                checked={calls}
                onChange={(e) => setCalls(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-750 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Playful Chimes & Sound Effects
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Play cheerful Web Audio completion bells and call ringtones
                </span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-750 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Quiet Hours Mode
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Mute all non-urgent sound and popups between 10:00 PM and 8:00 AM
                </span>
              </div>
              <input
                type="checkbox"
                checked={quietHours}
                onChange={(e) => setQuietHours(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
