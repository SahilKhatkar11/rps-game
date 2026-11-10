import React from 'react';
import { Settings, History, Code } from 'lucide-react';
import { MatchConfig } from '../types';
import { AppLogo } from './AppLogo';

interface NavbarProps {
  config: MatchConfig;
  historyCount: number;
  onOpenHistoryModal: () => void;
  onOpenPythonModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  historyCount,
  onOpenHistoryModal,
  onOpenPythonModal,
  onOpenSettingsModal,
}) => {
  return (
    <header id="app-navbar" className="shrink-0 bg-[#0f172a]/75 backdrop-blur-2xl border-b border-white/10 text-slate-100 px-3 sm:px-5 py-1.5 sm:py-2 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <AppLogo size="md" />
          <div className="flex flex-col justify-center">
            <h1 className="font-brand-title font-black text-base sm:text-lg md:text-2xl flex flex-col leading-[1.05] tracking-wider my-auto select-none">
              <span className="text-pink-400 drop-shadow-[0_0_12px_rgba(255,42,133,0.6)]">ROCK</span>
              <span className="text-sky-400 drop-shadow-[0_0_12px_rgba(0,210,255,0.6)]">PAPER</span>
              <span className="text-yellow-400 drop-shadow-[0_0_12px_rgba(255,200,0,0.6)]">SCISSORS</span>
            </h1>
          </div>
        </div>

        {/* Clean Header Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* History Log Button */}
          <button
            id="open-history-btn"
            onClick={onOpenHistoryModal}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 text-xs sm:text-sm font-semibold transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
          >
            <History className="w-4 h-4 text-indigo-300 shrink-0" />
            <span className="hidden xs:inline sm:inline">History</span>
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono text-[10px] sm:text-xs font-bold leading-none">
              {historyCount}
            </span>
          </button>

          {/* Python Engine / Algorithm Selector Button */}
          <button
            id="open-python-btn"
            onClick={onOpenPythonModal}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-mono font-bold transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            title="Algorithm Selection & Python Engine"
          >
            <Code className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Algorithm</span>
          </button>

          {/* Settings Modal Button */}
          <button
            id="open-settings-btn"
            onClick={onOpenSettingsModal}
            className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            title="Game Settings"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
