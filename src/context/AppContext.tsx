import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  TaskItem,
  GroupSpace,
  ChatConversation,
  ChatMessage,
  CallState,
  CallHistoryItem,
  NotificationItem,
  FriendRequest,
  NavigationTab,
  ThemeType,
  ChecklistItem,
  TaskPriority,
  TaskCategory,
  CallParticipant,
} from '../types';
import {
  CURRENT_USER,
  BUDDY_PROFILES,
  INITIAL_GROUPS,
  INITIAL_TASKS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_CALL_HISTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_FRIEND_REQUESTS,
} from '../data/initialData';
import { soundManager } from '../utils/audio';
import { fireConfetti, fireCelebrationCannon } from '../utils/confetti';

interface AppContextType {
  // Navigation & UI state
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  isRouletteOpen: boolean;
  setIsRouletteOpen: (open: boolean) => void;
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (open: boolean) => void;
  isInviteModalOpen: boolean;
  setIsInviteModalOpen: (open: boolean) => void;
  activeChatConvId: string | null;
  setActiveChatConvId: (id: string | null) => void;

  // User & Buddies
  currentUser: UserProfile;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  buddies: UserProfile[];
  addBuddy: (usernameOrEmail: string) => boolean;
  friendRequests: FriendRequest[];
  acceptFriendRequest: (reqId: string) => void;
  declineFriendRequest: (reqId: string) => void;

  // Tasks
  tasks: TaskItem[];
  createTask: (task: Omit<TaskItem, 'id' | 'createdAt' | 'comments' | 'cheers'>) => void;
  updateTask: (taskId: string, updates: Partial<TaskItem>) => void;
  toggleTaskStatus: (taskId: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  deleteTask: (taskId: string) => void;
  addTaskComment: (taskId: string, text: string) => void;
  cheerTask: (taskId: string, emoji: string) => void;
  assignBuddyToTask: (taskId: string, buddyId: string) => void;

  // Groups
  groups: GroupSpace[];
  createGroup: (group: Omit<GroupSpace, 'id' | 'createdAt'>) => void;
  updateGroupQuestProgress: (groupId: string, countChange: number) => void;

  // Chat
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  sendMessage: (convId: string, text: string, attachedTaskId?: string, replyTo?: ChatMessage['replyTo']) => void;
  toggleMessageReaction: (convId: string, msgId: string, emoji: string) => void;
  deleteMessage: (convId: string, msgId: string) => void;
  editMessage: (convId: string, msgId: string, newText: string) => void;
  createTaskFromMessage: (text: string) => void;
  toggleMuteConversation: (convId: string) => void;

  // Calls & Focus Sprint
  callState: CallState;
  startCall: (roomName: string, type: 'video' | 'audio', initialBuddyId?: string) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
  inviteBuddyToCall: (buddyId: string) => void;
  callHistory: CallHistoryItem[];
  incomingCall: {
    roomName: string;
    callerName: string;
    callerAvatar: string;
    type: 'video' | 'audio';
  } | null;
  triggerSimulatedIncomingCall: () => void;
  answerIncomingCall: () => void;
  declineIncomingCall: () => void;

  // Focus Sprint controls
  startFocusSprint: (minutes?: number, taskTitle?: string) => void;
  pauseFocusSprint: () => void;
  resumeFocusSprint: () => void;
  resetFocusSprint: () => void;
  setAmbientSound: (sound: 'none' | 'rain' | 'cafe' | 'drone') => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  snoozeTaskReminder: (taskId: string, durationMinutes: number) => void;

  // Theme & Sound settings
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'taskbuddies_v1_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // localStorage might fail in restricted iframe mode
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeChatConvId, setActiveChatConvId] = useState<string | null>('conv_maya');

  // Core Data
  const [currentUser, setCurrentUser] = useState<UserProfile>(() =>
    loadFromStorage('current_user', CURRENT_USER)
  );
  const [buddies] = useState<UserProfile[]>(() =>
    loadFromStorage('buddies', BUDDY_PROFILES)
  );
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() =>
    loadFromStorage('friend_requests', INITIAL_FRIEND_REQUESTS)
  );
  const [tasks, setTasks] = useState<TaskItem[]>(() =>
    loadFromStorage('tasks', INITIAL_TASKS)
  );
  const [groups, setGroups] = useState<GroupSpace[]>(() =>
    loadFromStorage('groups', INITIAL_GROUPS)
  );
  const [conversations, setConversations] = useState<ChatConversation[]>(() =>
    loadFromStorage('conversations', INITIAL_CONVERSATIONS)
  );
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() =>
    loadFromStorage('messages', INITIAL_MESSAGES)
  );
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>(() =>
    loadFromStorage('call_history', INITIAL_CALL_HISTORY)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage('notifications', INITIAL_NOTIFICATIONS)
  );

  // Settings
  const [theme, setThemeState] = useState<ThemeType>(() => currentUser.theme || 'sunset');
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => currentUser.notificationPrefs?.sound ?? true);

  // Calls
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    callId: '',
    roomName: '',
    type: 'video',
    participants: [],
    isMuted: false,
    isCameraOff: false,
    isScreenSharing: false,
    hasMediaPermission: null,
    focusSprint: {
      isActive: false,
      isPaused: false,
      mode: '25m',
      totalSeconds: 25 * 60,
      remainingSeconds: 25 * 60,
      ambientSound: 'none',
    },
  });

  const [incomingCall, setIncomingCall] = useState<{
    roomName: string;
    callerName: string;
    callerAvatar: string;
    type: 'video' | 'audio';
  } | null>(null);

  // Apply Theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-sunset', 'theme-mint', 'theme-lavender', 'theme-sunny', 'theme-dark');
    root.classList.add(`theme-${theme}`);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync state to localStorage
  useEffect(() => {
    saveToStorage('current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveToStorage('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('groups', groups);
  }, [groups]);

  useEffect(() => {
    saveToStorage('conversations', conversations);
  }, [conversations]);

  useEffect(() => {
    saveToStorage('messages', messages);
  }, [messages]);

  useEffect(() => {
    saveToStorage('notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage('call_history', callHistory);
  }, [callHistory]);

  useEffect(() => {
    saveToStorage('friend_requests', friendRequests);
  }, [friendRequests]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    setCurrentUser((prev) => ({ ...prev, theme: newTheme }));
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    soundManager.setSoundEnabled(enabled);
    setCurrentUser((prev) => ({
      ...prev,
      notificationPrefs: { ...prev.notificationPrefs, sound: enabled },
    }));
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  // Focus sprint timer effect
  useEffect(() => {
    let timer: number | null = null;
    if (callState.focusSprint.isActive && !callState.focusSprint.isPaused) {
      timer = window.setInterval(() => {
        setCallState((prev) => {
          if (!prev.focusSprint.isActive || prev.focusSprint.isPaused) return prev;
          if (prev.focusSprint.remainingSeconds <= 1) {
            // Completed sprint!
            soundManager.playTaskComplete();
            fireCelebrationCannon();
            // add notification
            setNotifications((n) => [
              {
                id: `notif_${Date.now()}`,
                type: 'achievement',
                title: 'Focus Sprint Complete! 🏆',
                message: `Awesome job! You finished your ${prev.focusSprint.mode} focus co-working block!`,
                timestamp: 'Just now',
                read: false,
              },
              ...n,
            ]);
            return {
              ...prev,
              focusSprint: {
                ...prev.focusSprint,
                isActive: false,
                remainingSeconds: prev.focusSprint.totalSeconds,
              },
            };
          }
          return {
            ...prev,
            focusSprint: {
              ...prev.focusSprint,
              remainingSeconds: prev.focusSprint.remainingSeconds - 1,
            },
          };
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callState.focusSprint.isActive, callState.focusSprint.isPaused]);

  // Tasks actions
  const createTask = (taskData: Omit<TaskItem, 'id' | 'createdAt' | 'comments' | 'cheers'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
      comments: [],
      cheers: [],
    };
    setTasks((prev) => [newTask, ...prev]);
    soundManager.playPop();

    // If assigned to a group with an active quest, check
    if (newTask.groupId) {
      updateGroupQuestProgress(newTask.groupId, 1);
    }
  };

  const updateTask = (taskId: string, updates: Partial<TaskItem>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isNowCompleted = t.status !== 'completed';
          if (isNowCompleted) {
            soundManager.playTaskComplete();
            fireConfetti();
            // Streak progress bump if first today
            setCurrentUser((u) => ({
              ...u,
              streakDays: u.streakDays + 1,
            }));
          } else {
            soundManager.playPop();
          }
          return {
            ...t,
            status: isNowCompleted ? 'completed' : 'pending',
            completedAt: isNowCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedChecklist = t.checklist.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          );
          soundManager.playPop();
          return { ...t, checklist: updatedChecklist };
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const addTaskComment = (taskId: string, text: string) => {
    const comment = {
      id: `comm_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorAvatar: currentUser.avatar,
      text,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t
      )
    );
    soundManager.playPop();
  };

  const cheerTask = (taskId: string, emoji: string) => {
    soundManager.playPop();
    fireConfetti();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const already = t.cheers.some((c) => c.userId === currentUser.id && c.emoji === emoji);
          const newCheers = already
            ? t.cheers.filter((c) => !(c.userId === currentUser.id && c.emoji === emoji))
            : [
                ...t.cheers,
                {
                  id: `ch_${Date.now()}`,
                  userId: currentUser.id,
                  userName: currentUser.displayName,
                  emoji,
                },
              ];
          return { ...t, cheers: newCheers };
        }
        return t;
      })
    );
  };

  const assignBuddyToTask = (taskId: string, buddyId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const hasAssignee = t.assigneeIds.includes(buddyId);
          const newAssignees = hasAssignee
            ? t.assigneeIds.filter((id) => id !== buddyId)
            : [...t.assigneeIds, buddyId];
          return { ...t, assigneeIds: newAssignees };
        }
        return t;
      })
    );
  };

  // Groups
  const createGroup = (groupData: Omit<GroupSpace, 'id' | 'createdAt'>) => {
    const newGroup: GroupSpace = {
      ...groupData,
      id: `grp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGroups((prev) => [...prev, newGroup]);
    soundManager.playPop();
  };

  const updateGroupQuestProgress = (groupId: string, countChange: number) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const nextCount = Math.min(
            g.quest.targetTasks,
            Math.max(0, g.quest.currentTasks + countChange)
          );
          if (nextCount === g.quest.targetTasks && g.quest.currentTasks < g.quest.targetTasks) {
            fireCelebrationCannon();
            soundManager.playTaskComplete();
          }
          return {
            ...g,
            quest: {
              ...g.quest,
              currentTasks: nextCount,
            },
          };
        }
        return g;
      })
    );
  };

  // Friends & Buddies
  const addBuddy = (usernameOrEmail: string): boolean => {
    if (!usernameOrEmail.trim()) return false;
    soundManager.playPop();
    // Simulate pending invitation or friend request
    const cleanHandle = usernameOrEmail.trim().toLowerCase().replace('@', '');
    const dummyReq: FriendRequest = {
      id: `req_${Date.now()}`,
      fromUserId: `user_${cleanHandle}`,
      fromUserName: usernameOrEmail.trim(),
      fromUserHandle: `@${cleanHandle}`,
      fromUserAvatar: '/src/assets/images/avatar_buddy_maya_1793258226388.jpg',
      sentAt: 'Just now',
      status: 'pending',
    };
    setFriendRequests((prev) => [dummyReq, ...prev]);
    return true;
  };

  const acceptFriendRequest = (reqId: string) => {
    soundManager.playPop();
    fireConfetti();
    setFriendRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'accepted' } : r))
    );
  };

  const declineFriendRequest = (reqId: string) => {
    setFriendRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'declined' } : r))
    );
  };

  // Chat
  const sendMessage = (
    convId: string,
    text: string,
    attachedTaskId?: string,
    replyTo?: ChatMessage['replyTo']
  ) => {
    if (!text.trim() && !attachedTaskId) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {},
      attachedTaskId,
      replyTo,
      status: 'sent',
    };

    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));

    // Update conversation last message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: text || 'Shared a task link',
              lastTimestamp: 'Just now',
            }
          : c
      )
    );

    soundManager.playPop();

    // Friendly buddy response simulation if chatting with Maya or Leo after 1.5s
    if (convId === 'conv_maya' || convId === 'conv_leo') {
      const buddy = buddies.find((b) => b.id === (convId === 'conv_maya' ? 'user_maya' : 'user_leo'));
      if (buddy) {
        setTimeout(() => {
          const autoReplies = [
            "Awesome! Let's get right to it! 🚀",
            "Love this! Want to jump on a quick 15-min focus call?",
            "Added that to my list too! You're crushing it today.",
            "Sounds like a great plan! Cheering you on! ✨",
          ];
          const chosenReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
          const replyMsg: ChatMessage = {
            id: `msg_${Date.now()}`,
            conversationId: convId,
            senderId: buddy.id,
            senderName: buddy.displayName,
            senderAvatar: buddy.avatar,
            text: chosenReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: {},
            status: 'delivered',
          };
          setMessages((prev) => ({
            ...prev,
            [convId]: [...(prev[convId] || []), replyMsg],
          }));
          soundManager.playPop();
        }, 1600);
      }
    }
  };

  const toggleMessageReaction = (convId: string, msgId: string, emoji: string) => {
    soundManager.playPop();
    setMessages((prev) => {
      const list = prev[convId] || [];
      const updated = list.map((msg) => {
        if (msg.id === msgId) {
          const currentUsers = msg.reactions[emoji] || [];
          const hasReacted = currentUsers.includes(currentUser.id);
          const nextUsers = hasReacted
            ? currentUsers.filter((u) => u !== currentUser.id)
            : [...currentUsers, currentUser.id];

          const newReactions = { ...msg.reactions };
          if (nextUsers.length > 0) {
            newReactions[emoji] = nextUsers;
          } else {
            delete newReactions[emoji];
          }
          return { ...msg, reactions: newReactions };
        }
        return msg;
      });
      return { ...prev, [convId]: updated };
    });
  };

  const deleteMessage = (convId: string, msgId: string) => {
    setMessages((prev) => {
      const list = prev[convId] || [];
      return { ...prev, [convId]: list.filter((m) => m.id !== msgId) };
    });
  };

  const editMessage = (convId: string, msgId: string, newText: string) => {
    setMessages((prev) => {
      const list = prev[convId] || [];
      return {
        ...prev,
        [convId]: list.map((m) =>
          m.id === msgId ? { ...m, text: newText, isEdited: true } : m
        ),
      };
    });
  };

  const createTaskFromMessage = (text: string) => {
    const cleanTitle = text.slice(0, 60);
    createTask({
      title: cleanTitle,
      description: text,
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      priority: 'medium',
      category: 'Personal',
      checklist: [{ id: `cl_${Date.now()}`, text: 'Follow up on chat discussion', completed: false }],
      assigneeIds: [currentUser.id],
      status: 'pending',
    });
    setActiveTab('tasks');
  };

  const toggleMuteConversation = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, muted: !c.muted } : c))
    );
  };

  // Calls
  const startCall = (roomName: string, type: 'video' | 'audio', initialBuddyId?: string) => {
    soundManager.playPop();
    const participants: CallParticipant[] = [
      {
        id: currentUser.id,
        name: currentUser.displayName,
        avatar: currentUser.avatar,
        isMuted: false,
        isCameraOff: type === 'audio',
        isSpeaking: true,
        currentFocus: currentUser.currentFocusTask,
        isHost: true,
      },
    ];

    if (initialBuddyId) {
      const buddy = buddies.find((b) => b.id === initialBuddyId);
      if (buddy) {
        participants.push({
          id: buddy.id,
          name: buddy.displayName,
          avatar: buddy.avatar,
          isMuted: false,
          isCameraOff: false,
          isSpeaking: false,
          currentFocus: buddy.currentFocusTask,
        });
      }
    } else {
      // Add Maya by default for a friendly social buddy presence
      const maya = buddies[0];
      if (maya) {
        participants.push({
          id: maya.id,
          name: maya.displayName,
          avatar: maya.avatar,
          isMuted: false,
          isCameraOff: false,
          isSpeaking: false,
          currentFocus: maya.currentFocusTask,
        });
      }
    }

    setCallState({
      isActive: true,
      callId: `call_${Date.now()}`,
      roomName,
      type,
      participants,
      isMuted: false,
      isCameraOff: type === 'audio',
      isScreenSharing: false,
      hasMediaPermission: null,
      focusSprint: {
        isActive: false,
        isPaused: false,
        mode: '25m',
        totalSeconds: 25 * 60,
        remainingSeconds: 25 * 60,
        ambientSound: 'none',
      },
      startTime: new Date().toISOString(),
    });

    setActiveTab('calls');
  };

  const endCall = () => {
    soundManager.stopAmbient();
    soundManager.playPop();

    if (callState.isActive) {
      const historyItem: CallHistoryItem = {
        id: `call_hist_${Date.now()}`,
        roomName: callState.roomName || 'Focus Hangout',
        type: callState.type,
        participants: callState.participants.map((p) => p.name),
        timestamp: 'Just now',
        durationSeconds: 900,
        status: 'completed',
      };
      setCallHistory((prev) => [historyItem, ...prev]);
    }

    setCallState((prev) => ({
      ...prev,
      isActive: false,
      callId: '',
      hasMediaPermission: null,
      focusSprint: {
        ...prev.focusSprint,
        isActive: false,
      },
    }));
  };

  const toggleMute = () => {
    soundManager.playPop();
    setCallState((prev) => {
      const nextMuted = !prev.isMuted;
      return {
        ...prev,
        isMuted: nextMuted,
        participants: prev.participants.map((p) =>
          p.id === currentUser.id ? { ...p, isMuted: nextMuted } : p
        ),
      };
    });
  };

  const toggleCamera = () => {
    soundManager.playPop();
    setCallState((prev) => {
      const nextCameraOff = !prev.isCameraOff;
      return {
        ...prev,
        isCameraOff: nextCameraOff,
        participants: prev.participants.map((p) =>
          p.id === currentUser.id ? { ...p, isCameraOff: nextCameraOff } : p
        ),
      };
    });
  };

  const toggleScreenShare = () => {
    soundManager.playPop();
    setCallState((prev) => ({
      ...prev,
      isScreenSharing: !prev.isScreenSharing,
    }));
  };

  const inviteBuddyToCall = (buddyId: string) => {
    const buddy = buddies.find((b) => b.id === buddyId);
    if (!buddy) return;
    soundManager.playPop();

    if (!callState.participants.some((p) => p.id === buddyId)) {
      setCallState((prev) => ({
        ...prev,
        participants: [
          ...prev.participants,
          {
            id: buddy.id,
            name: buddy.displayName,
            avatar: buddy.avatar,
            isMuted: false,
            isCameraOff: false,
            isSpeaking: false,
            currentFocus: buddy.currentFocusTask,
          },
        ],
      }));
    }
  };

  const triggerSimulatedIncomingCall = () => {
    soundManager.startRingtone();
    const buddy = buddies[0]; // Maya Lin
    setIncomingCall({
      roomName: 'Quiet Co-working Sprint',
      callerName: buddy.displayName,
      callerAvatar: buddy.avatar,
      type: 'video',
    });
  };

  const answerIncomingCall = () => {
    soundManager.stopRingtone();
    if (!incomingCall) return;
    const { roomName, type } = incomingCall;
    setIncomingCall(null);
    startCall(roomName, type, 'user_maya');
  };

  const declineIncomingCall = () => {
    soundManager.stopRingtone();
    setIncomingCall(null);
    soundManager.playPop();
  };

  // Focus Sprint
  const startFocusSprint = (minutes = 25, taskTitle?: string) => {
    soundManager.playPop();
    const totalSec = minutes * 60;
    const mode = minutes === 15 ? '15m' : minutes === 50 ? '50m' : '25m';

    setCallState((prev) => ({
      ...prev,
      focusSprint: {
        ...prev.focusSprint,
        isActive: true,
        isPaused: false,
        mode,
        totalSeconds: totalSec,
        remainingSeconds: totalSec,
        taskTitle: taskTitle || currentUser.currentFocusTask || 'Focus Block',
      },
    }));
  };

  const pauseFocusSprint = () => {
    soundManager.playPop();
    setCallState((prev) => ({
      ...prev,
      focusSprint: {
        ...prev.focusSprint,
        isPaused: true,
      },
    }));
  };

  const resumeFocusSprint = () => {
    soundManager.playPop();
    setCallState((prev) => ({
      ...prev,
      focusSprint: {
        ...prev.focusSprint,
        isPaused: false,
      },
    }));
  };

  const resetFocusSprint = () => {
    soundManager.playPop();
    soundManager.stopAmbient();
    setCallState((prev) => ({
      ...prev,
      focusSprint: {
        ...prev.focusSprint,
        isActive: false,
        isPaused: false,
        remainingSeconds: prev.focusSprint.totalSeconds,
        ambientSound: 'none',
      },
    }));
  };

  const setAmbientSound = (sound: 'none' | 'rain' | 'cafe' | 'drone') => {
    soundManager.playAmbient(sound);
    setCallState((prev) => ({
      ...prev,
      focusSprint: {
        ...prev.focusSprint,
        ambientSound: sound,
      },
    }));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const snoozeTaskReminder = (taskId: string, durationMinutes: number) => {
    soundManager.playPop();
    setNotifications((prev) =>
      prev.filter((n) => n.relatedTaskId !== taskId)
    );
    // Add toast or notification feedback
    setTimeout(() => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setNotifications((prev) => [
          {
            id: `notif_${Date.now()}`,
            type: 'due_date',
            title: 'Snoozed Reminder',
            message: `Reminder for "${task.title}" is due now!`,
            timestamp: 'Just now',
            read: false,
            relatedTaskId: task.id,
          },
          ...prev,
        ]);
      }
    }, durationMinutes * 60 * 1000);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedTaskId,
        setSelectedTaskId,
        isRouletteOpen,
        setIsRouletteOpen,
        isNewTaskModalOpen,
        setIsNewTaskModalOpen,
        isInviteModalOpen,
        setIsInviteModalOpen,
        activeChatConvId,
        setActiveChatConvId,

        currentUser,
        updateCurrentUser,
        buddies,
        addBuddy,
        friendRequests,
        acceptFriendRequest,
        declineFriendRequest,

        tasks,
        createTask,
        updateTask,
        toggleTaskStatus,
        toggleChecklistItem,
        deleteTask,
        addTaskComment,
        cheerTask,
        assignBuddyToTask,

        groups,
        createGroup,
        updateGroupQuestProgress,

        conversations,
        messages,
        sendMessage,
        toggleMessageReaction,
        deleteMessage,
        editMessage,
        createTaskFromMessage,
        toggleMuteConversation,

        callState,
        startCall,
        endCall,
        toggleMute,
        toggleCamera,
        toggleScreenShare,
        inviteBuddyToCall,
        callHistory,
        incomingCall,
        triggerSimulatedIncomingCall,
        answerIncomingCall,
        declineIncomingCall,

        startFocusSprint,
        pauseFocusSprint,
        resumeFocusSprint,
        resetFocusSprint,
        setAmbientSound,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        snoozeTaskReminder,

        theme,
        setTheme,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
