import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserPlus,
  Copy,
  Check,
  Video,
  MessageSquare,
  Sparkles,
  Flame,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Link,
  Shield,
} from 'lucide-react';

export const FriendsView: React.FC = () => {
  const {
    buddies,
    friendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    addBuddy,
    currentUser,
    startCall,
    setActiveTab,
    setActiveChatConvId,
  } = useApp();

  const [usernameInput, setUsernameInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  const inviteLink = `${window.location.origin}/invite/${currentUser.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    const ok = addBuddy(usernameInput.trim());
    if (ok) {
      setAddFeedback(`Friend request sent to ${usernameInput.trim()}! 🎉`);
      setUsernameInput('');
      setTimeout(() => setAddFeedback(null), 3000);
    }
  };

  const pendingRequests = friendRequests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Buddies & Friend Circles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Connect with friends, see what they're focusing on, and team up.
          </p>
        </div>

        {/* Share Invite Link Button */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Link Copied!</span>
            </>
          ) : (
            <>
              <Link className="w-4 h-4 text-orange-500" />
              <span>Copy Invite Link</span>
            </>
          )}
        </button>
      </div>

      {/* Add Buddy Form & Invite Bar */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Add a Buddy
        </h2>
        <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Enter buddy username or email (e.g. @kai_builds, sam@example.com)..."
            className="flex-1 text-xs px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer shrink-0"
          >
            Send Friend Request
          </button>
        </form>

        {addFeedback && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
            {addFeedback}
          </div>
        )}
      </div>

      {/* Pending Friend Requests */}
      {pendingRequests.length > 0 && (
        <div className="p-6 bg-amber-50/60 dark:bg-slate-800/80 rounded-2xl border border-amber-200/80 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300">
              Friend Requests ({pendingRequests.length})
            </h3>
          </div>

          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-3 bg-white dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={req.fromUserAvatar}
                    alt={req.fromUserName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {req.fromUserName}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium font-mono">
                      {req.fromUserHandle} · {req.sentAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => acceptFriendRequest(req.id)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => declineFriendRequest(req.id)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buddy Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Your Buddies ({buddies.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buddies.map((buddy) => {
            const statusColor =
              buddy.status === 'focusing'
                ? 'bg-amber-500'
                : buddy.status === 'online'
                ? 'bg-emerald-500'
                : 'bg-slate-400';

            return (
              <div
                key={buddy.id}
                className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={buddy.avatar}
                        alt={buddy.displayName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${statusColor}`}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {buddy.displayName}
                      </h4>
                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-mono">
                        @{buddy.username}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-300 px-2.5 py-1 rounded-lg">
                    <Flame className="w-3.5 h-3.5 fill-orange-500" />
                    <span className="font-mono tabular-nums">{buddy.streakDays}d streak</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {buddy.bio}
                </p>

                {/* Current Focus Task */}
                {buddy.currentFocusTask && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-xl text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Currently Focusing On
                    </span>
                    <div className="font-medium text-slate-900 dark:text-white truncate">
                      🎯 {buddy.currentFocusTask}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {buddy.badges.slice(0, 2).map((b) => (
                      <span
                        key={b}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveChatConvId(buddy.id === 'user_maya' ? 'conv_maya' : 'conv_leo');
                        setActiveTab('chat');
                      }}
                      className="p-2 text-slate-600 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                      title="Send message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => startCall(`Co-work with ${buddy.displayName}`, 'video', buddy.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Co-Work</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
