import React from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, PhoneOff, Video } from 'lucide-react';

export const IncomingCallModal: React.FC = () => {
  const { incomingCall, answerIncomingCall, declineIncomingCall } = useApp();

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 text-white rounded-3xl p-6 text-center shadow-2xl border border-slate-700 space-y-6">
        
        {/* Pulsing Avatar */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping duration-1000" />
          <div className="absolute -inset-2 rounded-full border border-emerald-500/40 animate-pulse" />
          <img
            src={incomingCall.callerAvatar}
            alt={incomingCall.callerName}
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-full object-cover ring-4 ring-emerald-500 relative z-10"
          />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Incoming Focus Call...
          </span>
          <h3 className="text-xl font-extrabold text-white">
            {incomingCall.callerName}
          </h3>
          <p className="text-xs text-slate-400">
            inviting you to "{incomingCall.roomName}"
          </p>
        </div>

        {/* Answer / Decline Controls */}
        <div className="flex items-center justify-center gap-6 pt-2">
          {/* Decline */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={declineIncomingCall}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
              title="Decline"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <span className="text-xs text-slate-400">Decline</span>
          </div>

          {/* Answer */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={answerIncomingCall}
              className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer animate-bounce"
              title="Answer"
            >
              <Video className="w-6 h-6" />
            </button>
            <span className="text-xs text-emerald-400 font-semibold">Answer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
