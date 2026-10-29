export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'Personal' | 'Study' | 'Work' | 'Trip' | 'Health' | 'Creative';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type UserStatus = 'online' | 'focusing' | 'away' | 'offline';
export type ThemeType = 'sunset' | 'mint' | 'lavender' | 'sunny' | 'dark';
export type NavigationTab = 'home' | 'tasks' | 'groups' | 'chat' | 'calls' | 'friends' | 'settings';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  status: UserStatus;
  currentFocusTask?: string;
  streakDays: number;
  badges: string[];
  theme: ThemeType;
  visibility: 'friends' | 'public' | 'busy';
  notificationPrefs: {
    dueReminders: boolean;
    assignments: boolean;
    chatMentions: boolean;
    calls: boolean;
    sound: boolean;
    quietHours: boolean;
  };
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface TaskCheer {
  id: string;
  userId: string;
  userName: string;
  emoji: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: TaskPriority;
  category: TaskCategory;
  checklist: ChecklistItem[];
  assigneeIds: string[]; // User IDs
  groupId?: string; // Associated shared space
  status: TaskStatus;
  completedAt?: string;
  createdAt: string;
  recurring?: 'none' | 'daily' | 'weekly';
  comments: TaskComment[];
  cheers: TaskCheer[];
}

export interface GroupSpace {
  id: string;
  name: string;
  description: string;
  emoji: string;
  accentColor: string;
  memberIds: string[];
  quest: {
    title: string;
    targetTasks: number;
    currentTasks: number;
    rewardBadge: string;
    deadline: string;
  };
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  fromUserHandle: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  reactions: Record<string, string[]>; // emoji -> [userIds]
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  attachedTaskId?: string;
  isEdited?: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatConversation {
  id: string;
  type: 'direct' | 'group';
  participantIds: string[];
  groupId?: string;
  name?: string;
  avatar?: string;
  muted: boolean;
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount: number;
}

export interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeaking: boolean;
  currentFocus?: string;
  isHost?: boolean;
}

export interface FocusSprintState {
  isActive: boolean;
  isPaused: boolean;
  mode: '15m' | '25m' | '50m';
  totalSeconds: number;
  remainingSeconds: number;
  ambientSound: 'none' | 'rain' | 'cafe' | 'drone';
  taskTitle?: string;
}

export interface CallState {
  isActive: boolean;
  callId: string;
  roomName: string;
  type: 'video' | 'audio';
  participants: CallParticipant[];
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  hasMediaPermission: boolean | null; // null = not requested yet
  errorMessage?: string;
  focusSprint: FocusSprintState;
  startTime?: string;
}

export interface CallHistoryItem {
  id: string;
  roomName: string;
  type: 'video' | 'audio';
  participants: string[];
  timestamp: string;
  durationSeconds: number;
  status: 'completed' | 'missed';
}

export interface NotificationItem {
  id: string;
  type: 'due_date' | 'assignment' | 'mention' | 'call' | 'achievement' | 'cheer';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedTaskId?: string;
  relatedCallId?: string;
  relatedUserId?: string;
}
