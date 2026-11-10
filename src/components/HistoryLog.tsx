import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Trash2, Filter, X, Check } from 'lucide-react';
import { RoundRecord } from '../types';
import { MOVE_DETAILS } from '../utils/pythonEngine';
import { NeonMoveIcon } from './NeonMoveIcon';

interface HistoryLogProps {
  isOpen: boolean;
  onClose: () => void;
  history: RoundRecord[];
  onClearHistory: () => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  const [filter, setFilter] = useState<'all' | 'win' | 'lose' | 'tie'>('all');
  const [confirmClear, setConfirmClear] = useState(false);
  const [toastCleared, setToastCleared] = useState(false);

  const handleExecuteClear = () => {
    onClearHistory();
    setConfirmClear(false);
    setToastCleared(true);
    setTimeout(() => {
      setToastCleared(false);
    }, 2200);
  };

  const handleClose = () => {
    setConfirmClear(false);
    onClose();
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.outcome === filter;
  });

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
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="w-full max-w-2xl h-[88vh] max-h-[720px] bg-[#0f172a]/95 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Match History Log
                    <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                      {history.length} Rounds
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Round records & bot strategies • Scoreboard & win streaks remain intact
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer"
                aria-label="Close match history"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Toolbar */}
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between gap-2 shrink-0 flex-nowrap whitespace-nowrap overflow-x-auto min-w-0">
              <div className="flex items-center gap-1 bg-black/30 p-1 rounded-2xl border border-white/10 text-xs backdrop-blur-md shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 shrink-0" />
                {(['all', 'win', 'lose', 'tie'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-xl capitalize font-medium transition-all ${
                      filter === f
                        ? 'bg-indigo-600/80 text-white font-bold border border-indigo-400/40 shadow-lg'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs shrink-0">
                {toastCleared ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-semibold text-xs shrink-0 whitespace-nowrap">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Logs Cleared</span>
                  </div>
                ) : confirmClear ? (
                  <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                    <button
                      onClick={handleExecuteClear}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs border border-red-400/50 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                    >
                      Yes, Confirm
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs border border-white/15 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClear(true)}
                    disabled={history.length === 0}
                    title="Clear history logs only (keeps scoreboard and streaks intact)"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-400/30 font-semibold transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shrink-0 whitespace-nowrap"
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Clear History</span>
                  </button>
                )}
              </div>
            </div>

            {/* Round List - All items strictly in a single straight line */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-1.5 flex-1 min-h-0 bg-black/20">
              {filteredHistory.length > 0 ? (
                filteredHistory.slice().reverse().map(item => (
                  <div
                    key={item.id}
                    className="px-3 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-between gap-2 sm:gap-3 flex-nowrap whitespace-nowrap overflow-x-auto min-w-0 shadow-sm hover:border-white/20 transition-all"
                  >
                    {/* Left: Round #, Outcome Badge, Matchup (#48 TIE You: Scissors vs Bot: Scissors) */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <span className="font-mono text-indigo-300 font-bold text-[10px] sm:text-[11px] shrink-0 min-w-[28px]">
                        #{item.roundNumber}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold font-mono uppercase border shrink-0 tracking-wider ${
                          item.outcome === 'win'
                            ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                            : item.outcome === 'lose'
                            ? 'bg-pink-500/20 border-pink-400/40 text-pink-300'
                            : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                        }`}
                      >
                        {item.outcome.toUpperCase()}
                      </span>

                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] shrink-0">
                        <span className="text-slate-400">You:</span>
                        <span className="flex items-center gap-1 font-semibold text-white">
                          <NeonMoveIcon move={item.userMove} size="xs" glow={false} />
                          <span>{MOVE_DETAILS[item.userMove]?.name}</span>
                        </span>
                        <span className="text-white/30 font-normal px-0.5">vs</span>
                        <span className="text-slate-400">Bot:</span>
                        <span className="flex items-center gap-1 font-semibold text-white">
                          <NeonMoveIcon move={item.computerMove} size="xs" glow={false} />
                          <span>{MOVE_DETAILS[item.computerMove]?.name}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Strategy & Timestamp (random 13:14) */}
                    <div className="flex items-center gap-2 sm:gap-2.5 text-slate-400 font-mono text-[10px] sm:text-[11px] shrink-0 ml-auto pl-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-indigo-200 border border-white/10 text-[9px] sm:text-[10px] shrink-0">
                        {item.strategyUsed}
                      </span>
                      <span className="text-slate-400 shrink-0">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400">
                  No match history found. Start playing rounds to generate logs!
                </div>
              )}
            </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <span>Auto-saved to local browser storage</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold border border-indigo-400/40 shadow-lg"
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
