import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Volume2, VolumeX, RefreshCw, Target, Keyboard, Info, Check } from 'lucide-react';
import { MatchConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MatchConfig;
  onUpdateConfig: (newConfig: Partial<MatchConfig>) => void;
  onResetStats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onResetStats,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleExecuteReset = () => {
    onResetStats();
    setConfirmReset(false);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setConfirmReset(false);
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="w-full max-w-xl h-[88vh] max-h-[720px] bg-[#0f172a]/95 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="px-6 py-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Game Settings
                  </h3>
                  <p className="text-xs text-slate-300">
                    Customize rules, sound, and controls
                  </p>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 sm:space-y-3.5 text-xs text-slate-200 bg-black/20 flex-1 min-h-0">
              {/* Keyboard Controls & Instructions */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 shadow-md space-y-2">
                <label className="font-bold text-indigo-300 text-xs uppercase tracking-wider block flex items-center gap-1.5">
                  <Keyboard className="w-3.5 h-3.5" /> Keyboard Controls
                </label>
                <div className="space-y-1 text-slate-300 text-xs">
                  <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                    <span>Select Rock</span>
                    <kbd className="font-mono bg-white/10 px-2 py-0.5 rounded border border-white/15 text-indigo-200 text-[10px] font-bold">1</kbd>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                    <span>Select Paper</span>
                    <kbd className="font-mono bg-white/10 px-2 py-0.5 rounded border border-white/15 text-indigo-200 text-[10px] font-bold">2</kbd>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                    <span>Select Scissors</span>
                    <kbd className="font-mono bg-white/10 px-2 py-0.5 rounded border border-white/15 text-indigo-200 text-[10px] font-bold">3</kbd>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span>Next Round</span>
                    <kbd className="font-mono bg-white/10 px-2 py-0.5 rounded border border-white/15 text-indigo-200 text-[10px] font-bold">Space / Enter</kbd>
                  </div>
                </div>
              </div>

              {/* Match Target Rules */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 shadow-md space-y-2">
                <label className="font-bold text-amber-300 text-xs uppercase tracking-wider block flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Series Victory Target
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateConfig({ targetScore: null })}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all ${
                      config.targetScore === null
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 font-bold shadow-md'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-xs">Endless Match</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">No round limit</div>
                  </button>

                  <button
                    onClick={() => onUpdateConfig({ targetScore: 3 })}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all ${
                      config.targetScore === 3
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 font-bold shadow-md'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-xs">First to 3 Wins</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Best-of-5 Series</div>
                  </button>
                </div>
              </div>

              {/* Audio & Animation Toggles */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 shadow-md space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">Sound Effects & SFX</div>
                    <div className="text-[11px] text-slate-300">Play audio for moves and results</div>
                  </div>
                  <button
                    onClick={() => onUpdateConfig({ soundEnabled: !config.soundEnabled })}
                    className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                      config.soundEnabled
                        ? 'bg-indigo-600/80 border-indigo-400/50 text-white'
                        : 'bg-white/10 border-white/15 text-slate-400'
                    }`}
                  >
                    {config.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>{config.soundEnabled ? 'Enabled' : 'Muted'}</span>
                  </button>
                </div>

                <div className="border-t border-white/10 pt-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">Instant Mode</div>
                    <div className="text-[11px] text-slate-300">Skip 3-second countdown timer</div>
                  </div>
                  <button
                    onClick={() => onUpdateConfig({ fastAnimation: !config.fastAnimation })}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      config.fastAnimation
                        ? 'bg-emerald-500/30 border-emerald-400/50 text-emerald-200'
                        : 'bg-white/10 border-white/15 text-slate-400'
                    }`}
                  >
                    {config.fastAnimation ? 'ON (Instant)' : 'OFF (3s Count)'}
                  </button>
                </div>
              </div>

              {/* Reset Stats Section */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">Reset Game Data</div>
                    <div className="text-[11px] text-slate-300">Clear all scoreboards, win streaks, and match history</div>
                  </div>
                </div>

                <div className="h-[44px] w-full">
                  {showSuccessToast ? (
                    <div className="w-full h-full px-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold flex items-center justify-center gap-2 text-xs">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>All Statistics & Scores Reset Successfully!</span>
                    </div>
                  ) : confirmReset ? (
                    <div className="w-full h-full flex items-center gap-2">
                      <button
                        onClick={handleExecuteReset}
                        className="flex-1 h-full px-3 rounded-xl bg-red-600 hover:bg-red-500 border border-red-400/50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                        <span>Yes, Clear Everything</span>
                      </button>
                      <button
                        onClick={() => setConfirmReset(false)}
                        className="h-full px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 font-bold text-xs transition-all shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmReset(true)}
                      className="w-full h-full px-3.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-400/30 text-pink-300 font-bold flex items-center justify-between text-xs transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-pink-400 shrink-0" />
                        <span>Reset All Stats & Scoreboard</span>
                      </div>
                      <span className="text-[10px] text-pink-300 font-mono">Clear Data</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Triad Hand Engine Description Section */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 shadow-md space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                  <h4 className="font-brand-sub text-xs uppercase tracking-widest text-indigo-300 font-bold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    Triad Hand Engine
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  An advanced Rock-Paper-Scissors decision suite featuring real-time pattern tracking, Markov chain move prediction, dynamic counter-strategies, and detailed match analytics.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-white/5 border-t border-white/10 flex items-center justify-end shrink-0">
              <button
                onClick={() => {
                  setConfirmReset(false);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs border border-indigo-400/40 shadow-md"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
