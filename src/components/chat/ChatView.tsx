import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Trash2,
  Edit2,
  Reply,
  BellOff,
  Bell,
  PlusSquare,
  Sparkles,
  ArrowRight,
  Video,
} from 'lucide-react';
import { ChatMessage } from '../../types';

export const ChatView: React.FC = () => {
  const {
    conversations,
    messages,
    sendMessage,
    toggleMessageReaction,
    deleteMessage,
    editMessage,
    createTaskFromMessage,
    toggleMuteConversation,
    currentUser,
    activeChatConvId,
    setActiveChatConvId,
    tasks,
    setSelectedTaskId,
    startCall,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editInputVal, setEditInputVal] = useState('');
  const [selectedTaskToAttach, setSelectedTaskToAttach] = useState<string>('');
  const [isTaskPickerOpen, setIsTaskPickerOpen] = useState(false);

  const activeConv =
    conversations.find((c) => c.id === activeChatConvId) || conversations[0];
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() && !selectedTaskToAttach) return;
    if (!activeConv) return;

    sendMessage(
      activeConv.id,
      inputVal.trim(),
      selectedTaskToAttach || undefined,
      replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderName,
            text: replyingTo.text,
          }
        : undefined
    );

    setInputVal('');
    setReplyingTo(null);
    setSelectedTaskToAttach('');
    setIsTaskPickerOpen(false);
  };

  const handleSaveEdit = (msgId: string) => {
    if (!activeConv || !editInputVal.trim()) return;
    editMessage(activeConv.id, msgId, editInputVal.trim());
    setEditingMsgId(null);
  };

  return (
    <div className="pb-8 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex-1 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex overflow-hidden">
        
        {/* Left: Conversations List */}
        <div className="w-full sm:w-80 border-r border-slate-200 dark:border-slate-750 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 dark:border-slate-750 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Buddy Chats
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-750/50">
            {conversations.map((c) => {
              const isActive = c.id === activeConv?.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveChatConvId(c.id)}
                  className={`w-full p-3.5 flex items-start gap-3 transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-orange-50/70 dark:bg-orange-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="relative shrink-0">
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-lg">
                        💬
                      </div>
                    )}
                    {c.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {c.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono tabular-nums shrink-0">
                        {c.lastTimestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {c.lastMessage || 'Say hello to your buddy!'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Conversation */}
        {activeConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50/40 dark:bg-slate-900/40">
            {/* Top Bar inside Chat */}
            <div className="p-3.5 bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-750 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeConv.avatar ? (
                  <img
                    src={activeConv.avatar}
                    alt={activeConv.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-sm">
                    💬
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeConv.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Active in sprint</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mute button */}
                <button
                  onClick={() => toggleMuteConversation(activeConv.id)}
                  title={activeConv.muted ? 'Unmute chat' : 'Mute chat'}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  {activeConv.muted ? (
                    <BellOff className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </button>

                {/* Instant Focus Call with Buddy */}
                <button
                  onClick={() => startCall(`Co-work: ${activeConv.name}`, 'video')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Call Buddy</span>
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.map((msg) => {
                const isMine = msg.senderId === currentUser.id;
                const attachedTask = msg.attachedTaskId
                  ? tasks.find((t) => t.id === msg.attachedTaskId)
                  : null;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 group ${
                      isMine ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {!isMine && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                      />
                    )}

                    <div className={`max-w-[75%] space-y-1.5 ${isMine ? 'items-end' : ''}`}>
                      {/* Sender label for group chat */}
                      {!isMine && activeConv.type === 'group' && (
                        <div className="text-[11px] font-semibold text-slate-500 px-1">
                          {msg.senderName}
                        </div>
                      )}

                      {/* Replying banner */}
                      {msg.replyTo && (
                        <div className="text-[10px] p-2 bg-slate-200/60 dark:bg-slate-750 rounded-lg text-slate-600 dark:text-slate-300 border-l-2 border-orange-500">
                          <span className="font-semibold block">{msg.replyTo.senderName}</span>
                          <span className="truncate block">{msg.replyTo.text}</span>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`p-3 rounded-2xl text-xs relative ${
                          isMine
                            ? 'bg-orange-500 text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs border border-slate-200/80 dark:border-slate-700 shadow-xs'
                        }`}
                      >
                        {editingMsgId === msg.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editInputVal}
                              onChange={(e) => setEditInputVal(e.target.value)}
                              className="w-full text-xs p-1.5 bg-white text-slate-900 rounded border border-slate-300"
                            />
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => handleSaveEdit(msg.id)}
                                className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px]"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingMsgId(null)}
                                className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        )}

                        {/* Attached Task Card preview */}
                        {attachedTask && (
                          <div
                            onClick={() => setSelectedTaskId(attachedTask.id)}
                            className="mt-2 p-2.5 bg-orange-50 dark:bg-slate-750 text-slate-900 dark:text-slate-100 rounded-xl border border-orange-200 dark:border-slate-600 cursor-pointer hover:bg-orange-100/60 transition-colors"
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span>🎯 {attachedTask.title}</span>
                              <ArrowRight className="w-3 h-3 text-orange-500" />
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                              {attachedTask.category} · Due {attachedTask.dueDate} · {attachedTask.checklist.filter(c => c.completed).length}/{attachedTask.checklist.length} steps
                            </div>
                          </div>
                        )}

                        {/* Timestamp & Status */}
                        <div
                          className={`flex items-center justify-end gap-1 text-[10px] mt-1 font-mono tabular-nums ${
                            isMine ? 'text-orange-100' : 'text-slate-400'
                          }`}
                        >
                          {msg.isEdited && <span>(edited) ·</span>}
                          <span>{msg.timestamp}</span>
                          {isMine && (
                            <span>
                              {msg.status === 'read' ? (
                                <CheckCheck className="w-3 h-3 text-sky-200 inline" />
                              ) : (
                                <Check className="w-3 h-3 inline" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Reactions bar */}
                      <div className="flex flex-wrap items-center gap-1 px-1">
                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                          <button
                            key={emoji}
                            onClick={() => toggleMessageReaction(activeConv.id, msg.id, emoji)}
                            className={`px-1.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 border cursor-pointer ${
                              users.includes(currentUser.id)
                                ? 'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300'
                                : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span className="font-mono tabular-nums">{users.length}</span>
                          </button>
                        ))}

                        {/* Hover Quick Reaction Buttons */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          {['❤️', '🔥', '🎉', '👏'].map((em) => (
                            <button
                              key={em}
                              onClick={() => toggleMessageReaction(activeConv.id, msg.id, em)}
                              className="text-xs hover:scale-125 transition-transform p-0.5 cursor-pointer"
                            >
                              {em}
                            </button>
                          ))}

                          <button
                            onClick={() => setReplyingTo(msg)}
                            title="Reply to message"
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            <Reply className="w-3 h-3" />
                          </button>

                          {/* Create task from this chat message */}
                          <button
                            onClick={() => createTaskFromMessage(msg.text)}
                            title="Turn this message into a task quest"
                            className="p-1 text-slate-400 hover:text-orange-500 cursor-pointer"
                          >
                            <PlusSquare className="w-3 h-3" />
                          </button>

                          {/* Edit / Delete if mine */}
                          {isMine && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingMsgId(msg.id);
                                  setEditInputVal(msg.text);
                                }}
                                title="Edit message"
                                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteMessage(activeConv.id, msg.id)}
                                title="Delete message"
                                className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Replying banner in footer */}
            {replyingTo && (
              <div className="px-4 py-2 bg-orange-50 dark:bg-slate-800 border-t border-orange-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Reply className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Replying to {replyingTo.senderName}:
                  </span>
                  <span className="text-slate-500 truncate max-w-xs">{replyingTo.text}</span>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Attached task banner in footer */}
            {selectedTaskToAttach && (
              <div className="px-4 py-2 bg-emerald-50 dark:bg-slate-800 border-t border-emerald-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                  📎 Attaching task: {tasks.find((t) => t.id === selectedTaskToAttach)?.title}
                </span>
                <button
                  onClick={() => setSelectedTaskToAttach('')}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Task Picker dropdown */}
            {isTaskPickerOpen && (
              <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 max-h-40 overflow-y-auto space-y-1">
                <div className="text-[11px] font-bold text-slate-500 mb-1">
                  Select a task to attach to chat:
                </div>
                {tasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTaskToAttach(t.id);
                      setIsTaskPickerOpen(false);
                    }}
                    className="w-full text-left p-1.5 rounded text-xs hover:bg-slate-100 dark:hover:bg-slate-700 truncate cursor-pointer"
                  >
                    🎯 {t.title}
                  </button>
                ))}
              </div>
            )}

            {/* Message Input Box */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white dark:bg-slate-850 border-t border-slate-200 dark:border-slate-750 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setIsTaskPickerOpen(!isTaskPickerOpen)}
                title="Attach a quest task"
                className="p-2 text-slate-400 hover:text-orange-500 rounded-lg cursor-pointer transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={`Message ${activeConv.name}...`}
                className="flex-1 text-xs px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="submit"
                disabled={!inputVal.trim() && !selectedTaskToAttach}
                className="p-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};
