import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Trash2,
  Share2,
  Plus,
  Send,
  MessageSquare,
  Users,
  Repeat,
  Heart,
  Flame,
} from 'lucide-react';
import { TaskCategory, TaskPriority } from '../../types';

interface TaskDetailModalProps {
  taskId: string;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, onClose }) => {
  const {
    tasks,
    updateTask,
    toggleTaskStatus,
    toggleChecklistItem,
    deleteTask,
    addTaskComment,
    cheerTask,
    assignBuddyToTask,
    currentUser,
    buddies,
    groups,
    sendMessage,
    setActiveTab,
    setActiveChatConvId,
  } = useApp();

  const task = tasks.find((t) => t.id === taskId);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title || '');
  const [editDesc, setEditDesc] = useState(task?.description || '');
  const [editCategory, setEditCategory] = useState<TaskCategory>(task?.category || 'Personal');
  const [editPriority, setEditPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [editDueDate, setEditDueDate] = useState(task?.dueDate || '');

  if (!task) return null;

  const group = groups.find((g) => g.id === task.groupId);
  const isCompleted = task.status === 'completed';

  const handleSaveEdits = () => {
    updateTask(task.id, {
      title: editTitle,
      description: editDesc,
      category: editCategory,
      priority: editPriority,
      dueDate: editDueDate,
    });
    setIsEditing(false);
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: `cl_${Date.now()}`,
      text: newChecklistText.trim(),
      completed: false,
    };
    updateTask(task.id, {
      checklist: [...task.checklist, newItem],
    });
    setNewChecklistText('');
  };

  const handleRemoveChecklist = (itemId: string) => {
    updateTask(task.id, {
      checklist: task.checklist.filter((i) => i.id !== itemId),
    });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addTaskComment(task.id, newCommentText.trim());
    setNewCommentText('');
  };

  const handleShareToChat = () => {
    const targetConvId = task.groupId === 'grp_kyoto' ? 'conv_kyoto' : 'conv_maya';
    sendMessage(targetConvId, `Take a look at "${task.title}"!`, task.id);
    setActiveChatConvId(targetConvId);
    setActiveTab('chat');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-850 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-750 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleTaskStatus(task.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>

            {group && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {group.emoji} {group.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareToChat}
              title="Share in Chat"
              className="p-2 text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                deleteTask(task.id);
                onClose();
              }}
              title="Delete Task"
              className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Title & Description */}
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-lg font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-medium"
                placeholder="Task title"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={3}
                className="w-full text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 font-medium placeholder:text-slate-500"
                placeholder="Description"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdits}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {task.title}
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-orange-600 hover:underline cursor-pointer font-medium"
                >
                  Edit details
                </button>
              </div>
              {task.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {task.description}
                </p>
              )}
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 dark:border-slate-750 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Priority</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 capitalize mt-0.5 block">
                {task.priority}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Category</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">
                {task.category}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Due Date</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200 mt-0.5 block">
                {task.dueDate || 'No due date'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Recurring</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 capitalize mt-0.5 block">
                {task.recurring || 'None'}
              </span>
            </div>
          </div>

          {/* Assignees Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Buddies Assigned
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {/* Current user */}
              <button
                onClick={() => assignBuddyToTask(task.id, currentUser.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer border ${
                  task.assigneeIds.includes(currentUser.id)
                    ? 'bg-orange-50 border-orange-300 text-orange-800 dark:bg-orange-950/60 dark:border-orange-800 dark:text-orange-200 font-medium'
                    : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                <img src={currentUser.avatar} alt="You" className="w-4 h-4 rounded-full object-cover" />
                <span>You ({currentUser.displayName.split(' ')[0]})</span>
              </button>

              {/* Buddies */}
              {buddies.map((buddy) => {
                const isAssigned = task.assigneeIds.includes(buddy.id);
                return (
                  <button
                    key={buddy.id}
                    onClick={() => assignBuddyToTask(task.id, buddy.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer border ${
                      isAssigned
                        ? 'bg-orange-50 border-orange-300 text-orange-800 dark:bg-orange-950/60 dark:border-orange-800 dark:text-orange-200 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                    }`}
                  >
                    <img src={buddy.avatar} alt={buddy.displayName} className="w-4 h-4 rounded-full object-cover" />
                    <span>{buddy.displayName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checklist Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Checklist ({task.checklist.filter((i) => i.completed).length}/{task.checklist.length})
              </h4>
            </div>

            <div className="space-y-1.5">
              {task.checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <button
                    onClick={() => toggleChecklistItem(task.id, item.id)}
                    className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer flex-1 text-left"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={item.completed ? 'line-through text-slate-400' : ''}>
                      {item.text}
                    </span>
                  </button>

                  <button
                    onClick={() => handleRemoveChecklist(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add checklist item form */}
            <form onSubmit={handleAddChecklist} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                placeholder="Add checklist step..."
                className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-slate-800 text-white dark:bg-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>

          {/* Comments Thread */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-750">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Buddy Comments ({task.comments.length})</span>
            </h4>

            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {task.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No comments yet. Leave a note or encourage a buddy!</p>
              ) : (
                task.comments.map((comm) => (
                  <div key={comm.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={comm.authorAvatar}
                      alt={comm.authorName}
                      className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {comm.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comm.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {comm.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add comment form */}
            <form onSubmit={handlePostComment} className="flex items-center gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a cheerful note or comment..."
                className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
