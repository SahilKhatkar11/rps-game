import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Copy, Check, Cpu, Code2, Play, Sparkles, BookOpen } from 'lucide-react';
import { AIStrategy } from '../types';
import { PYTHON_SOURCE_CODE } from '../utils/pythonEngine';

interface PythonLogicPanelProps {
  currentStrategy: AIStrategy;
  onSelectStrategy: (strategy: AIStrategy) => void;
  isOpen: boolean;
  onClose: () => void;
  lastTraceLogs?: string[];
}

export const PythonLogicPanel: React.FC<PythonLogicPanelProps> = ({
  currentStrategy,
  onSelectStrategy,
  isOpen,
  onClose,
  lastTraceLogs = [],
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'source' | 'console'>('source');

  const code = PYTHON_SOURCE_CODE[currentStrategy] || PYTHON_SOURCE_CODE.random;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="w-full max-w-2xl h-[88vh] max-h-[720px] bg-[#0f172a]/95 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl"
          >
            {/* Modal Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-300">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white whitespace-nowrap">
                Python Game Logic Engine
              </h3>
              <p className="text-xs text-slate-300 whitespace-nowrap">
                Inspect and switch the Python algorithms dictating computer selections
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Selector Bar */}
        <div className="px-5 py-3 bg-white/5 border-b border-white/10 shrink-0">
          <div className="text-xs font-semibold text-slate-300 mb-2">Algorithm Selection:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['random', 'counter', 'markov', 'weighted'] as AIStrategy[]).map(strat => (
              <button
                key={strat}
                onClick={() => onSelectStrategy(strat)}
                className={`px-2 py-1.5 rounded-xl text-xs font-mono transition-all text-center ${
                  currentStrategy === strat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10'
                }`}
              >
                {strat === 'random' && '🎲 Random'}
                {strat === 'counter' && '🧠 Counter'}
                {strat === 'markov' && '🔮 Markov'}
                {strat === 'weighted' && '⚖️ Weighted'}
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm Explanation - Fixed at its place constantly */}
        <div className="px-5 py-3 bg-black/30 border-b border-white/10 shrink-0 flex items-start gap-2.5 text-xs">
          <BookOpen className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-emerald-300 text-xs mb-0.5">Algorithm Explanation</p>
            <p className="text-slate-300 text-[11px] leading-snug">
              {currentStrategy === 'random' && 'Uses Python\'s standard pseudo-random generator (Mersenne Twister) via random.choice() for un-biased picks.'}
              {currentStrategy === 'counter' && 'Evaluates user frequency with Python\'s collections.Counter to predict and play the exact counter move.'}
              {currentStrategy === 'markov' && 'Builds a 1st-order Markov transition probability table P(X_t | X_t-1) modeling user sequential behavior.'}
              {currentStrategy === 'weighted' && 'Applies a reciprocal time-decay weighting formula w = 1 / (t + 1) favoring recent user choices.'}
            </p>
          </div>
        </div>

        {/* Scrollable Code & Trace Logs Container */}
        <div className="p-4 overflow-y-auto flex-1 min-h-0 font-mono text-xs text-slate-200 bg-black/20 space-y-3">
          {/* File Name & Copy Code */}
          <div className="flex items-center justify-between text-slate-300 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <Code2 className="w-3.5 h-3.5" /> rps_logic_{currentStrategy}.py
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] transition-colors border border-white/10"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code pre block */}
          <pre className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-emerald-300/90 overflow-x-auto leading-relaxed shadow-inner text-[11px]">
            <code>{code}</code>
          </pre>

          {/* Execution Trace Log Section */}
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                <Play className="w-3.5 h-3.5 text-emerald-400" /> Last Execution Trace Log
              </span>
              <span className="text-emerald-400 text-[10px]">Status: Exit 0</span>
            </div>
            {lastTraceLogs.length > 0 ? (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1 text-[11px] text-slate-200">
                {lastTraceLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-slate-500 select-none">{i + 1}.</span>
                    <span className={log.includes('Success') ? 'text-emerald-300 font-bold' : log.includes('Decision') ? 'text-amber-300' : 'text-slate-200'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-slate-400 text-[11px] text-center italic">
                Play a round to capture Python execution traces.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Python 3.11 WASM
            </span>
          </div>
          <button
            onClick={onClose}
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
