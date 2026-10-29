import React from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Heart,
  Flame,
  PartyPopper,
  Share2,
  MessageSquare,
  AlertCircle,
  Repeat,
} from 'lucide-react';

interface TaskCardProps {
  task: TaskItem;
  onSelect: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect }) => {
  const { toggleTaskStatus, cheerTask, currentUser, buddies, groups, setActiveTab, setActiveChatConvId, sendMessage } = useApp();

  const isCompleted = task.status === 'completed';
  const group = groups.find((g) => g.id === task.groupId);

  const checklistTotal = task.checklist.length;
  const checklistDone = task.checklist.filter((c) => c.completed).length;

  const priorityColors: Record<string, string> = {
    urgent: 'text-rose-600 dark:text-rose-400 font-semibold',
    high: 'text-orange-600 dark:text-orange-400 font-medium',
    medium: 'text-amber-600 dark:text-amber-400 font-medium',
    low: 'text-slate-500 dark:text-slate-400',
  };

  const handleShareToChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share into primary chat
    const targetConvId = task.groupId === 'grp_kyoto' ? 'conv_kyoto' : 'conv_maya';
    sendMessage(targetConvId, `Check out this quest task: "${task.title}"`, task.id);
    setActiveChatConvId(targetConvId);
    setActiveTab('chat');
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        isCompleted
          ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 shadow-xs hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskStatus(task.id);
          }}
          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
          aria-label={isCompleted ? 'Mark pending' : 'Mark completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/40" />
          ) : (
            <Circle className="w-5 h-5 stroke-[1.75]" />
          )}
        </button>

        {/* Task Core Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`text-sm font-semibold tracking-tight text-slate-900 dark:text-white truncate ${
                isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.title}
            </h4>

            {task.recurring && task.recurring !== 'none' && (
              <span title={`Recurring ${task.recurring}`} className="text-slate-400">
                <Repeat className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              {task.description}
            </p>
          )}

          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2.5">
            {group && (
              <>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {group.emoji} {group.name}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              </>
            )}

            <span>{task.category}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>

            <span className={priorityColors[task.priority] || ''}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
            </span>

            {task.dueDate && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span className="flex items-center gap-1 font-mono tabular-nums text-[11px]">
                  <Calendar className="w-3 h-3" />
                  {task.dueDate}
                </span>
              </>
            )}

            {checklistTotal > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span className="font-mono tabular-nums text-[11px]">
                  {checklistDone}/{checklistTotal} done
                </span>
              </>
            )}

            {task.comments.length > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span className="flex items-center gap-1 font-mono tabular-nums text-[11px]">
                  <MessageSquare className="w-3 h-3" />
                  {task.comments.length}
                </span>
              </>
            )}
          </div>

          {/* Checklist progress bar if exists */}
          {checklistTotal > 0 && (
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-2.5">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${(checklistDone / checklistTotal) * 100}%` }}
              />
            </div>
          )}

          {/* Bottom Card Footer: Cheers and Assignees */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-750">
            {/* Cheers */}
            <div className="flex items-center gap-1.5">
              {['❤️', '🔥', '🎉'].map((emoji) => {
                const cheerCount = task.cheers.filter((c) => c.emoji === emoji).length;
                const userCheered = task.cheers.some(
                  (c) => c.emoji === emoji && c.userId === currentUser.id
                );
                return (
                  <button
                    key={emoji}
                    onClick={(e) => {
                      e.stopPropagation();
                      cheerTask(task.id, emoji);
                    }}
                    className={`px-2 py-0.5 rounded-md text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                      userCheered
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 font-medium'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500'
                    }`}
                  >
                    <span>{emoji}</span>
                    {cheerCount > 0 && (
                      <span className="font-mono tabular-nums text-[11px]">{cheerCount}</span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={handleShareToChat}
                title="Share this task in chat"
                className="p-1 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-md transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Assignee avatars */}
            <div className="flex -space-x-1.5 overflow-hidden">
              {task.assigneeIds.map((userId) => {
                const user =
                  userId === currentUser.id
                    ? currentUser
                    : buddies.find((b) => b.id === userId);
                if (!user) return null;
                return (
                  <img
                    key={userId}
                    src={user.avatar}
                    alt={user.displayName}
                    title={user.displayName}
                    referrerPolicy="no-referrer"
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
