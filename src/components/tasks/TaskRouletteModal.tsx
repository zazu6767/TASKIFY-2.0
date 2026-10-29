import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { TaskItem } from '../../types';
import { soundManager } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';

interface TaskRouletteModalProps {
  onClose: () => void;
}

export const TaskRouletteModal: React.FC<TaskRouletteModalProps> = ({ onClose }) => {
  const { tasks, setSelectedTaskId } = useApp();
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');

  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [spinIndex, setSpinIndex] = useState(0);

  const handleSpin = () => {
    if (pendingTasks.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedTask(null);

    let count = 0;
    const totalSpins = 24 + Math.floor(Math.random() * 8);
    const intervalTime = 80;

    const interval = setInterval(() => {
      count++;
      const nextIdx = Math.floor(Math.random() * pendingTasks.length);
      setSpinIndex(nextIdx);
      soundManager.playTick();

      if (count >= totalSpins) {
        clearInterval(interval);
        const finalTask = pendingTasks[nextIdx];
        setSelectedTask(finalTask);
        setIsSpinning(false);
        soundManager.playTaskComplete();
        fireConfetti();
      }
    }, intervalTime);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-850 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 text-center space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
          <Sparkles className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Task Roulette Picker
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            Stuck in task paralysis? Let the wheel pick your next fun focus quest!
          </p>
        </div>

        {/* Carousel Display */}
        {pendingTasks.length === 0 ? (
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500">
            No pending tasks right now! You’re totally free. ✨
          </div>
        ) : (
          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-750 rounded-2xl border border-amber-200/60 dark:border-slate-700 min-h-[140px] flex flex-col justify-center items-center shadow-inner">
            {selectedTask ? (
              <div className="space-y-2 animate-in zoom-in-95 duration-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  🎯 Your Next Adventure:
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedTask.title}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedTask.category} · Priority: {selectedTask.priority}
                </div>
              </div>
            ) : isSpinning ? (
              <div className="space-y-1">
                <span className="text-xs text-amber-600 font-mono animate-pulse">
                  Spinning through quests...
                </span>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                  {pendingTasks[spinIndex]?.title}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-xs text-slate-500">
                  Ready with {pendingTasks.length} pending tasks
                </span>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tap Spin to discover your next focus!
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {selectedTask ? (
            <>
              <button
                onClick={() => {
                  setSelectedTaskId(selectedTask.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <span>Start This Task</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSpin}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Spin Again</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleSpin}
              disabled={isSpinning || pendingTasks.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Spinning...' : 'Spin the Wheel!'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
