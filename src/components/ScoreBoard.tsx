import React from 'react';
import { Trophy, User, Bot, Flame, Equal, Target, RotateCcw } from 'lucide-react';
import { GameStats, MatchConfig } from '../types';

interface ScoreBoardProps {
  stats: GameStats;
  config: MatchConfig;
  matchWinner: 'user' | 'computer' | null;
  onResetSeries?: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ stats, config, matchWinner, onResetSeries }) => {
  const totalCompleted = stats.userWins + stats.computerWins;
  const winRate = totalCompleted > 0 ? Math.round((stats.userWins / totalCompleted) * 100) : 0;

  return (
    <div id="scoreboard-container" className="w-full max-w-5xl mx-auto px-2 sm:px-4 my-1 sm:my-2 shrink-0">
      {/* Target Match Series Status Banner */}
      {config.targetScore && (
        <div className="mb-1.5 sm:mb-2 px-3 py-1.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-between text-xs sm:text-sm font-medium shadow-sm">
          <div className="flex items-center gap-2 text-slate-200">
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <span>Tournament: <strong className="text-amber-300 font-bold">First to {config.targetScore} Wins</strong></span>
          </div>
          <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm">
            <span className={stats.userWins >= config.targetScore ? 'text-indigo-300 font-extrabold' : 'text-slate-300'}>
              You: {stats.userWins}
            </span>
            <span className="text-white/20">•</span>
            <span className={stats.computerWins >= config.targetScore ? 'text-pink-300 font-extrabold' : 'text-slate-300'}>
              CPU: {stats.computerWins}
            </span>
          </div>
        </div>
      )}

      {/* Proportionally Enlarged Grid Score Cards - Centered Alignment */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* User Card */}
        <div id="stat-card-user" className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 border border-white/10 shadow-md hover:border-indigo-500/30 transition-all flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-indigo-300 leading-none h-4 sm:h-5">
            <span className="inline-flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase leading-none select-none">
              YOU
            </span>
          </div>
          <div className="text-lg sm:text-2xl md:text-3xl font-black text-white font-mono leading-none mt-1.5 sm:mt-2 h-6 sm:h-7 md:h-8 flex items-center justify-center">
            {stats.userWins}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono hidden sm:inline-flex items-center justify-center mt-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 h-4 sm:h-5">
            Victories
          </span>
        </div>

        {/* Computer Card */}
        <div id="stat-card-bot" className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 border border-white/10 shadow-md hover:border-pink-500/30 transition-all flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-pink-300 leading-none h-4 sm:h-5">
            <span className="inline-flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase leading-none select-none">
              CPU
            </span>
          </div>
          <div className="text-lg sm:text-2xl md:text-3xl font-black text-white font-mono leading-none mt-1.5 sm:mt-2 h-6 sm:h-7 md:h-8 flex items-center justify-center">
            {stats.computerWins}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono hidden sm:inline-flex items-center justify-center mt-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 h-4 sm:h-5">
            Victories
          </span>
        </div>

        {/* Ties Card */}
        <div id="stat-card-ties" className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 border border-white/10 shadow-md hover:border-amber-500/30 transition-all flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-amber-300 leading-none h-4 sm:h-5">
            <span className="inline-flex items-center justify-center shrink-0">
              <Equal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase leading-none select-none">
              TIES
            </span>
          </div>
          <div className="text-lg sm:text-2xl md:text-3xl font-black text-amber-300 font-mono leading-none mt-1.5 sm:mt-2 h-6 sm:h-7 md:h-8 flex items-center justify-center">
            {stats.ties}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono hidden sm:inline-flex items-center justify-center mt-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 h-4 sm:h-5">
            {stats.totalRounds} Rnds
          </span>
        </div>

        {/* Streak Card */}
        <div id="stat-card-streak" className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 border border-white/10 shadow-md hover:border-orange-500/30 transition-all flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-orange-300 leading-none h-4 sm:h-5">
            <span className="inline-flex items-center justify-center shrink-0">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase leading-none select-none">
              STREAK
            </span>
          </div>
          <div className="text-lg sm:text-2xl md:text-3xl font-black text-indigo-200 font-mono leading-none mt-1.5 sm:mt-2 h-6 sm:h-7 md:h-8 flex items-center justify-center">
            {stats.currentStreak}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono hidden sm:inline-flex items-center justify-center mt-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 h-4 sm:h-5">
            {winRate}% Win
          </span>
        </div>
      </div>
    </div>
  );
};
