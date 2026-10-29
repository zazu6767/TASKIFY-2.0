import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  Share2,
  Users,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  PhoneIncoming,
  Calendar,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const CallsView: React.FC = () => {
  const {
    callState,
    startCall,
    endCall,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
    inviteBuddyToCall,
    callHistory,
    buddies,
    currentUser,
    startFocusSprint,
    pauseFocusSprint,
    resumeFocusSprint,
    resetFocusSprint,
    setAmbientSound,
    triggerSimulatedIncomingCall,
  } = useApp();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isInviteBuddyOpen, setIsInviteBuddyOpen] = useState(false);

  // Request actual camera & mic access when a call is active and type is video
  useEffect(() => {
    let streamInstance: MediaStream | null = null;

    if (callState.isActive && !callState.isCameraOff) {
      navigator.mediaDevices
        ?.getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          streamInstance = stream;
          setLocalStream(stream);
          setMediaError(null);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          // Graceful fallback if no webcam is connected or permission dismissed
          setMediaError(
            err.name === 'NotAllowedError'
              ? 'Camera/microphone access was declined. You can still co-work in voice or avatar mode!'
              : 'No physical webcam detected. Showing your buddy avatar with audio simulation.'
          );
        });
    } else {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
    }

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, [callState.isActive, callState.isCameraOff]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Focus Calls & Co-Working
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Work side-by-side with friends in real-time focus sessions.
          </p>
        </div>

        {!callState.isActive && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={triggerSimulatedIncomingCall}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <PhoneIncoming className="w-4 h-4 text-emerald-500" />
              <span>Simulate Ringing</span>
            </button>

            <button
              onClick={() => startCall('Focus Hangout Room', 'video')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Start Co-Work Call</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Call Canvas View */}
      {callState.isActive ? (
        <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-6">
          {/* Top Bar of Active Call */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold tracking-tight">
                  {callState.roomName}
                </h3>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  {callState.participants.length} buddies in room · Encrypted co-work
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsInviteBuddyOpen(!isInviteBuddyOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Invite Buddies</span>
              </button>

              <button
                onClick={endCall}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Leave Call</span>
              </button>
            </div>
          </div>

          {/* Fallback notice if permissions were not available */}
          {mediaError && (
            <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-xs text-amber-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{mediaError}</span>
            </div>
          )}

          {/* Participant Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {callState.participants.map((p) => {
              const isLocalUser = p.id === currentUser.id;

              return (
                <div
                  key={p.id}
                  className="relative aspect-video rounded-2xl bg-slate-800 overflow-hidden border border-slate-700/80 flex items-center justify-center shadow-inner group"
                >
                  {isLocalUser && !callState.isCameraOff && localStream ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : (
                    /* Avatar fallback display */
                    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="relative">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-600"
                        />
                        {/* Audio waveform simulated animation when speaking */}
                        {!p.isMuted && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-slate-900/90 px-1.5 py-0.5 rounded-full border border-slate-700">
                            <span className="w-1 h-3 bg-emerald-400 rounded-full animate-voice-wave" />
                            <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="w-1 h-4 bg-emerald-400 rounded-full animate-voice-wave" />
                          </div>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-slate-200">
                        {p.name} {isLocalUser ? '(You)' : ''}
                      </div>

                      {p.currentFocus && (
                        <div className="text-[10px] text-slate-400 max-w-[180px] truncate bg-slate-900/60 px-2 py-0.5 rounded-full border border-slate-700/50">
                          🎯 {p.currentFocus}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Overlays */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[11px] font-medium text-white truncate max-w-[140px]">
                      {p.name}
                    </span>

                    <div className="flex items-center gap-1">
                      {p.isMuted && (
                        <span className="p-1 bg-rose-900/80 rounded-md text-white">
                          <MicOff className="w-3 h-3" />
                        </span>
                      )}
                      {p.isCameraOff && (
                        <span className="p-1 bg-slate-700/80 rounded-md text-slate-300">
                          <VideoOff className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Invite buddies modal popover */}
          {isInviteBuddyOpen && (
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Invite online buddies into call:
              </h4>
              <div className="flex flex-wrap gap-2">
                {buddies.map((buddy) => {
                  const inCall = callState.participants.some((p) => p.id === buddy.id);
                  return (
                    <button
                      key={buddy.id}
                      onClick={() => inviteBuddyToCall(buddy.id)}
                      disabled={inCall}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer ${
                        inCall
                          ? 'bg-slate-700/50 text-slate-400 opacity-60 cursor-default'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      <img src={buddy.avatar} alt={buddy.displayName} className="w-4 h-4 rounded-full object-cover" />
                      <span>{buddy.displayName}</span>
                      {inCall && <span className="text-[10px] text-emerald-400">· In Call</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Integrated Focus Sprint Bar */}
          <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Focus Sprint Timer
                  </span>
                  {callState.focusSprint.isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-900/60 text-indigo-200 border border-indigo-700 font-medium">
                      {callState.focusSprint.isPaused ? 'Paused' : 'Active Sprint'}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-mono tabular-nums font-extrabold text-white mt-0.5">
                  {formatTime(callState.focusSprint.remainingSeconds)}
                </div>
              </div>
            </div>

            {/* Sprint Timer Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {!callState.focusSprint.isActive ? (
                <>
                  <button
                    onClick={() => startFocusSprint(15)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    15 min
                  </button>
                  <button
                    onClick={() => startFocusSprint(25)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-medium rounded-lg text-white cursor-pointer shadow-xs"
                  >
                    25 min (Standard)
                  </button>
                  <button
                    onClick={() => startFocusSprint(50)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    50 min Deep Work
                  </button>
                </>
              ) : (
                <>
                  {callState.focusSprint.isPaused ? (
                    <button
                      onClick={resumeFocusSprint}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold rounded-lg cursor-pointer text-white"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseFocusSprint}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-xs font-semibold rounded-lg cursor-pointer text-white"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </button>
                  )}
                  <button
                    onClick={resetFocusSprint}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                    title="Reset timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Ambient Sound dropdown */}
              <div className="flex items-center gap-1 pl-2 border-l border-slate-700">
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={callState.focusSprint.ambientSound}
                  onChange={(e) =>
                    setAmbientSound(e.target.value as 'none' | 'rain' | 'cafe' | 'drone')
                  }
                  className="bg-slate-700 text-xs text-slate-200 px-2 py-1 rounded-lg border border-slate-600 cursor-pointer"
                >
                  <option value="none">No Soundscape</option>
                  <option value="rain">🌧️ Gentle Rain</option>
                  <option value="cafe">☕️ Cafe Hum</option>
                  <option value="drone">🧘 Meditative Drone</option>
                </select>
              </div>
            </div>
          </div>

          {/* Call Controls Deck */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={toggleMute}
              className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                callState.isMuted
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={callState.isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {callState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleCamera}
              className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                callState.isCameraOff
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={callState.isCameraOff ? 'Turn camera on' : 'Turn camera off'}
            >
              {callState.isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleScreenShare}
              className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                callState.isScreenSharing
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title="Toggle Screen Share"
            >
              <Monitor className="w-5 h-5" />
            </button>

            <button
              onClick={endCall}
              className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
              title="Leave call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Call Room Launch Pad & Call History */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Quick Room Launchers */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Start a New Co-Working Call
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Jump into video or audio focus rooms. Your camera and microphone will only be requested when you click start.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => startCall('Quiet Focus Sprint Room', 'video')}
                  className="p-4 rounded-xl border border-orange-200 dark:border-slate-700 hover:border-orange-500 bg-orange-50/40 dark:bg-slate-750 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-3">
                    <Video className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                    Video Co-Work Sprint
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    With camera on or friendly avatar, 25-min Pomodoro timer, and soundscapes.
                  </p>
                </button>

                <button
                  onClick={() => startCall('Audio Chill Hangout', 'audio')}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-750 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3">
                    <Mic className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    Voice-Only Lounge
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Low bandwidth, cameras off, peaceful background talk while clearing quests.
                  </p>
                </button>
              </div>
            </div>

            {/* Standalone Focus Sprint Pomodoro */}
            <div className="p-6 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-slate-800 dark:to-slate-850 rounded-2xl border border-indigo-100 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Solo Focus Sprint & Soundscapes
                  </h3>
                </div>
                <span className="text-xs text-slate-500">Pomodoro mode</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Want to work without starting a full call? Spin up an ambient audio session with gentle rain or cafe background sound.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    startCall('Quiet Focus Room', 'audio');
                    startFocusSprint(25);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Start 25m Focus Block
                </button>

                <button
                  onClick={() => {
                    startCall('Deep Work 50m Room', 'audio');
                    startFocusSprint(50);
                  }}
                  className="px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  50m Deep Work
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Call History */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Call History
            </h3>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-750">
              {callHistory.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No call logs yet.
                </div>
              ) : (
                callHistory.map((item) => (
                  <div key={item.id} className="p-4 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.roomName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.participants.join(', ')}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono tabular-nums">
                        {item.timestamp} · {Math.round(item.durationSeconds / 60)} mins
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {item.status === 'completed' ? 'Completed' : 'Missed'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
