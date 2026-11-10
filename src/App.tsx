/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ScoreBoard } from './components/ScoreBoard';
import { GameArena } from './components/GameArena';
import { HistoryLog } from './components/HistoryLog';
import { PythonLogicPanel } from './components/PythonLogicPanel';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { GameStats, MatchConfig, RoundRecord, AIStrategy } from './types';
import { soundManager } from './utils/audio';

const STORAGE_KEY_STATS = 'rps_game_stats_v1';
const STORAGE_KEY_HISTORY = 'rps_game_history_v1';
const STORAGE_KEY_CONFIG = 'rps_game_config_v1';

const INITIAL_STATS: GameStats = {
  userWins: 0,
  computerWins: 0,
  ties: 0,
  totalRounds: 0,
  currentStreak: 0,
  bestStreak: 0,
};

const INITIAL_CONFIG: MatchConfig = {
  targetScore: null,
  strategy: 'random',
  soundEnabled: true,
  fastAnimation: false,
};

export default function App() {
  // Stats state
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  // History state
  const [history, setHistory] = useState<RoundRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Config state
  const [config, setConfig] = useState<MatchConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  // Modals state
  const [isPythonModalOpen, setIsPythonModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [matchWinner, setMatchWinner] = useState<'user' | 'computer' | null>(null);

  // Sync sound manager enabled state
  useEffect(() => {
    soundManager.setEnabled(config.soundEnabled);
  }, [config.soundEnabled]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {}
  }, [config]);

  // Update Config
  const handleUpdateConfig = (newConfig: Partial<MatchConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Handle Round Completion
  const handleRoundComplete = useCallback((round: RoundRecord) => {
    setHistory(prev => [...prev, round]);

    setStats(prev => {
      let newWins = prev.userWins;
      let newLosses = prev.computerWins;
      let newTies = prev.ties;
      let newStreak = prev.currentStreak;
      let newBestStreak = prev.bestStreak;

      if (round.outcome === 'win') {
        newWins += 1;
        newStreak += 1;
        if (newStreak > newBestStreak) {
          newBestStreak = newStreak;
        }
      } else if (round.outcome === 'lose') {
        newLosses += 1;
        newStreak = 0;
      } else {
        newTies += 1;
      }

      const newStats = {
        userWins: newWins,
        computerWins: newLosses,
        ties: newTies,
        totalRounds: prev.totalRounds + 1,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
      };

      // Check for match series winner if targetScore set
      if (config.targetScore) {
        if (newWins >= config.targetScore) {
          setMatchWinner('user');
        } else if (newLosses >= config.targetScore) {
          setMatchWinner('computer');
        }
      }

      return newStats;
    });
  }, [config.targetScore]);

  // Reset Series
  const handleResetSeries = () => {
    setStats(INITIAL_STATS);
    setMatchWinner(null);
  };

  // Reset Stats & Match
  const handleResetStats = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_STATS);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {}
    setStats(INITIAL_STATS);
    setHistory([]);
    setMatchWinner(null);
  };

  // Clear round history logs only (preserves scoreboard, streaks, and match status)
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {}
  };

  const lastRound = history[history.length - 1];
  const lastTraceLogs = lastRound?.reasoning ? [lastRound.reasoning] : [];

  const isAnyModalOpen = isHistoryModalOpen || isSettingsModalOpen || isPythonModalOpen;

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#0b1120] text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white relative select-none">
      {/* Frosted Glass Background Glowing Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-8%] left-1/2 -translate-x-1/2 w-[70%] h-[30%] bg-gradient-to-t from-sky-500/15 via-indigo-500/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Main UI Wrapper with Blur Effect on Modal Open */}
      <div className={`flex flex-col h-full w-full justify-between overflow-hidden min-h-0 ${isAnyModalOpen ? 'app-bg-blurred pointer-events-none select-none' : 'app-bg-normal'}`}>
        {/* Navbar with Liquid Glass Buttons */}
        <div className="relative z-10 shrink-0">
          <Navbar
            config={config}
            historyCount={history.length}
            onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
            onOpenPythonModal={() => setIsPythonModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          />
        </div>

        {/* Main Content Area - Single Page Fit */}
        <main className="flex-1 relative z-10 flex flex-col justify-between max-w-5xl mx-auto w-full min-h-0 px-2 sm:px-4 py-0.5 sm:py-1 overflow-hidden">
          {/* Compact Scoreboard */}
          <ScoreBoard
            stats={stats}
            config={config}
            matchWinner={matchWinner}
            onResetSeries={handleResetSeries}
          />

          {/* Main Game Arena */}
          <GameArena
            config={config}
            history={history}
            matchWinner={matchWinner}
            onRoundComplete={handleRoundComplete}
            onOpenPythonPanel={() => setIsPythonModalOpen(true)}
            onResetSeries={handleResetSeries}
          />

          {/* Footer Developer Note */}
          <div className="shrink-0">
            <Footer />
          </div>
        </main>
      </div>

      {/* Hidden Lists & Options inside Modals */}
      <HistoryLog
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        onResetStats={handleResetStats}
      />

      <PythonLogicPanel
        isOpen={isPythonModalOpen}
        onClose={() => setIsPythonModalOpen(false)}
        currentStrategy={config.strategy}
        onSelectStrategy={(strat: AIStrategy) => setConfig(prev => ({ ...prev, strategy: strat }))}
        lastTraceLogs={lastTraceLogs}
      />
    </div>
  );
}
