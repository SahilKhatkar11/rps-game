import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Zap, HelpCircle, Terminal, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Move, GameOutcome, RoundRecord, MatchConfig } from '../types';
import { MOVE_DETAILS, generateComputerChoice, evaluateWinner } from '../utils/pythonEngine';
import { MoveCard } from './MoveCard';
import { NeonMoveIcon } from './NeonMoveIcon';
import { soundManager } from '../utils/audio';

interface GameArenaProps {
  config: MatchConfig;
  history: RoundRecord[];
  matchWinner?: 'user' | 'computer' | null;
  onRoundComplete: (round: RoundRecord) => void;
  onOpenPythonPanel: () => void;
  onResetSeries?: () => void;
}

export const GameArena: React.FC<GameArenaProps> = ({
  config,
  history,
  matchWinner,
  onRoundComplete,
  onOpenPythonPanel,
  onResetSeries,
}) => {
  const [stage, setStage] = useState<'selecting' | 'countdown' | 'result'>('selecting');
  const [userSelection, setUserSelection] = useState<Move | null>(null);
  const [computerSelection, setComputerSelection] = useState<Move | null>(null);
  const [roundOutcome, setRoundOutcome] = useState<GameOutcome | null>(null);
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [pythonReasoning, setPythonReasoning] = useState<string>('');

  // Reset internal state when history is cleared
  useEffect(() => {
    if (history.length === 0) {
      setStage('selecting');
      setUserSelection(null);
      setComputerSelection(null);
      setRoundOutcome(null);
      setPythonReasoning('');
    }
  }, [history.length]);

  const availableMoves: Move[] = ['rock', 'paper', 'scissors'];

  // Trigger celebration confetti on win
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch {
      // fallback
    }
  }, []);

  // Handle player choice click
  const handlePlayMove = useCallback((selectedMove: Move) => {
    if (stage !== 'selecting') return;

    soundManager.playSelect();
    setUserSelection(selectedMove);

    // Compute CPU choice via Python Engine
    const { choice: cpuChoice, reasoning } = generateComputerChoice(
      config.strategy,
      history
    );

    setComputerSelection(cpuChoice);
    setPythonReasoning(reasoning);

    const outcome = evaluateWinner(selectedMove, cpuChoice);
    setRoundOutcome(outcome);

    if (config.fastAnimation) {
      finalizeRound(selectedMove, cpuChoice, outcome, reasoning);
    } else {
      setStage('countdown');
      setCountdownNum(3);
    }
  }, [stage, config, history]);

  // Finalize round and play sounds
  const finalizeRound = useCallback((
    uMove: Move,
    cMove: Move,
    outcome: GameOutcome,
    reasoning: string
  ) => {
    setStage('result');

    const newRecord: RoundRecord = {
      id: `rnd_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      roundNumber: history.length + 1,
      userMove: uMove,
      computerMove: cMove,
      outcome,
      timestamp: Date.now(),
      strategyUsed: config.strategy,
      reasoning,
    };

    onRoundComplete(newRecord);

    if (outcome === 'win') {
      soundManager.playWin();
      triggerConfetti();
    } else if (outcome === 'lose') {
      soundManager.playLose();
    } else {
      soundManager.playTie();
    }
  }, [history.length, config.strategy, onRoundComplete, triggerConfetti]);

  // Handle countdown animation timer
  useEffect(() => {
    if (stage !== 'countdown') return;

    soundManager.playCountdown();

    const timer = setTimeout(() => {
      if (countdownNum > 1) {
        setCountdownNum(prev => prev - 1);
      } else {
        if (userSelection && computerSelection && roundOutcome) {
          finalizeRound(userSelection, computerSelection, roundOutcome, pythonReasoning);
        }
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [stage, countdownNum, userSelection, computerSelection, roundOutcome, pythonReasoning, finalizeRound]);

  // Reset arena for next round or start fresh series
  const handlePlayAgain = useCallback(() => {
    if (matchWinner && onResetSeries) {
      onResetSeries();
    }
    setStage('selecting');
    setUserSelection(null);
    setComputerSelection(null);
    setRoundOutcome(null);
    setCountdownNum(3);
  }, [matchWinner, onResetSeries]);

  // Keyboard shortcut listener (1, 2, 3 and Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (stage === 'selecting') {
        if (e.key === '1') handlePlayMove('rock');
        if (e.key === '2') handlePlayMove('paper');
        if (e.key === '3') handlePlayMove('scissors');
      } else if (stage === 'result' && (e.code === 'Space' || e.key === 'Enter')) {
        e.preventDefault();
        handlePlayAgain();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, handlePlayMove, handlePlayAgain]);

  return (
    <div id="game-arena-container" className="w-full max-w-5xl mx-auto px-2 sm:px-4 my-0.5 sm:my-1 flex-1 flex flex-col justify-center min-h-0">
      <div className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/15 rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between min-h-0">
        {/* Background grid accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none" />

        {/* STAGE 1: MOVES SELECTOR */}
        {stage === 'selecting' && (
          <div className="flex-1 flex flex-col items-center justify-center my-auto relative z-10 py-1 sm:py-2">
            <p className="text-slate-200 text-xs sm:text-sm md:text-base font-semibold mb-3 sm:mb-5 text-center">
              Select your move:
            </p>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-5 md:gap-6 w-full max-w-3xl">
              {availableMoves.map((move, idx) => (
                <MoveCard
                  key={move}
                  move={move}
                  shortcutKey={(idx + 1).toString()}
                  isSelected={userSelection === move}
                  onClick={handlePlayMove}
                />
              ))}
            </div>

            {/* Quick helper note - moved down lower */}
            <div className="mt-5 sm:mt-7 md:mt-9 px-3.5 sm:px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] sm:text-xs text-slate-300 text-center max-w-md flex items-center justify-center gap-2 shadow-inner">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
              <span>Rock beats Scissors • Scissors beats Paper • Paper beats Rock</span>
            </div>
          </div>
        )}

        {/* STAGE 2: COUNTDOWN ANIMATION */}
        {stage === 'countdown' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-2 sm:py-4 relative z-10">
            <motion.div
              key={countdownNum}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.15, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center font-black tracking-wider drop-shadow-lg"
            >
              <div className="mb-3 sm:mb-4">
                {countdownNum === 3 && <NeonMoveIcon move="rock" size="3xl" glow={true} />}
                {countdownNum === 2 && <NeonMoveIcon move="paper" size="3xl" glow={true} />}
                {countdownNum === 1 && <NeonMoveIcon move="scissors" size="3xl" glow={true} />}
              </div>
              <span
                className={`text-2xl sm:text-3xl md:text-4xl font-black uppercase font-brand-title font-stretched-neon ${
                  countdownNum === 3
                    ? 'text-pink-400 drop-shadow-[0_0_6px_rgba(255,42,133,0.7)]'
                    : countdownNum === 2
                    ? 'text-sky-400 drop-shadow-[0_0_6px_rgba(0,210,255,0.7)]'
                    : 'text-yellow-400 drop-shadow-[0_0_6px_rgba(255,200,0,0.7)]'
                }`}
              >
                {countdownNum === 3 && 'ROCK!'}
                {countdownNum === 2 && 'PAPER!'}
                {countdownNum === 1 && 'SCISSORS!'}
              </span>
            </motion.div>
            {/* Moved lower down as requested */}
            <p className="text-slate-300 text-[10px] sm:text-xs font-mono mt-7 sm:mt-10 md:mt-12 flex items-center gap-2 bg-white/10 px-4 py-1.5 sm:py-2 rounded-full border border-white/15 shadow-md">
              <Zap className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              Calculating Bot move...
            </p>
          </div>
        )}

        {/* STAGE 3: RESULT SHOWDOWN */}
        {stage === 'result' && userSelection && computerSelection && roundOutcome && (
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-0.5 sm:py-1">
            {/* Outcome Banner */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full max-w-xl py-2 px-3 sm:px-5 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 text-center border backdrop-blur-xl shadow-lg flex flex-col items-center justify-center gap-0.5 ${
                roundOutcome === 'win'
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                  : roundOutcome === 'lose'
                  ? 'bg-red-500/20 border-red-400/50 text-red-200'
                  : 'bg-amber-500/20 border-amber-400/50 text-amber-200'
              }`}
            >
              <h3 className="text-lg sm:text-2xl md:text-3xl font-black tracking-wider uppercase font-mono leading-tight">
                {roundOutcome === 'win' && '🎉 YOU WIN!'}
                {roundOutcome === 'lose' && '🤖 COMPUTER WINS!'}
                {roundOutcome === 'tie' && '🤝 IT\'S A DRAW!'}
              </h3>
              <p className="text-[10px] sm:text-xs font-medium opacity-90">
                {roundOutcome === 'win' && `${MOVE_DETAILS[userSelection].name} beats ${MOVE_DETAILS[computerSelection].name}!`}
                {roundOutcome === 'lose' && `${MOVE_DETAILS[computerSelection].name} beats ${MOVE_DETAILS[userSelection].name}!`}
                {roundOutcome === 'tie' && `Both picked ${MOVE_DETAILS[userSelection].name}! Equal match.`}
              </p>
            </motion.div>

            {/* Battle Arena Versus Side-by-Side - Enlarged cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 w-full max-w-xl my-1 sm:my-2 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 border border-white/25 backdrop-blur-xl flex items-center justify-center text-[10px] sm:text-xs font-black italic text-white shadow-xl ring-2 ring-white/10">
                VS
              </div>

              {/* User Choice Card */}
              <div className={`flex flex-col items-center justify-between p-3 sm:p-5 md:p-6 min-h-[7.8rem] sm:min-h-[10rem] md:min-h-[11.6rem] rounded-2xl sm:rounded-3xl backdrop-blur-xl border transition-all duration-300 text-center relative shadow-lg ${
                userSelection === 'rock'
                  ? 'border-pink-500/40 bg-pink-500/10 shadow-[0_0_14px_rgba(255,42,133,0.22)]'
                  : userSelection === 'paper'
                  ? 'border-sky-500/40 bg-sky-500/10 shadow-[0_0_14px_rgba(0,210,255,0.22)]'
                  : 'border-yellow-500/40 bg-yellow-500/10 shadow-[0_0_14px_rgba(255,200,0,0.22)]'
              } ${
                roundOutcome === 'win'
                  ? 'ring-2 ring-emerald-400/80 shadow-[0_0_22px_rgba(52,211,153,0.35)]'
                  : ''
              }`}>
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 font-mono uppercase tracking-wider mb-0.5">
                  You
                </span>
                <div className="my-1 sm:my-2 flex items-center justify-center">
                  <NeonMoveIcon move={userSelection} size="2xl" glow={true} />
                </div>
                <h4 className="mt-1 flex items-center justify-center">
                  <span className={`text-xs sm:text-sm md:text-base font-black uppercase font-brand-title font-stretched-neon ${
                    userSelection === 'rock'
                      ? 'text-pink-400 drop-shadow-[0_0_4px_rgba(255,42,133,0.6)]'
                      : userSelection === 'paper'
                      ? 'text-sky-400 drop-shadow-[0_0_4px_rgba(0,210,255,0.6)]'
                      : 'text-yellow-400 drop-shadow-[0_0_4px_rgba(255,200,0,0.6)]'
                  }`}>
                    {MOVE_DETAILS[userSelection].name}
                  </span>
                </h4>
              </div>

              {/* Computer Choice Card */}
              <div className={`flex flex-col items-center justify-between p-3 sm:p-5 md:p-6 min-h-[7.8rem] sm:min-h-[10rem] md:min-h-[11.6rem] rounded-2xl sm:rounded-3xl backdrop-blur-xl border transition-all duration-300 text-center relative shadow-lg ${
                computerSelection === 'rock'
                  ? 'border-pink-500/40 bg-pink-500/10 shadow-[0_0_14px_rgba(255,42,133,0.22)]'
                  : computerSelection === 'paper'
                  ? 'border-sky-500/40 bg-sky-500/10 shadow-[0_0_14px_rgba(0,210,255,0.22)]'
                  : 'border-yellow-500/40 bg-yellow-500/10 shadow-[0_0_14px_rgba(255,200,0,0.22)]'
              } ${
                roundOutcome === 'lose'
                  ? 'ring-2 ring-red-400/80 shadow-[0_0_22px_rgba(248,113,113,0.35)]'
                  : ''
              }`}>
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 font-mono uppercase tracking-wider mb-0.5">
                  CPU
                </span>
                <div className="my-1 sm:my-2 flex items-center justify-center">
                  <NeonMoveIcon move={computerSelection} size="2xl" glow={true} />
                </div>
                <h4 className="mt-1 flex items-center justify-center">
                  <span className={`text-xs sm:text-sm md:text-base font-black uppercase font-brand-title font-stretched-neon ${
                    computerSelection === 'rock'
                      ? 'text-pink-400 drop-shadow-[0_0_4px_rgba(255,42,133,0.6)]'
                      : computerSelection === 'paper'
                      ? 'text-sky-400 drop-shadow-[0_0_4px_rgba(0,210,255,0.6)]'
                      : 'text-yellow-400 drop-shadow-[0_0_4px_rgba(255,200,0,0.6)]'
                  }`}>
                    {MOVE_DETAILS[computerSelection].name}
                  </span>
                </h4>
              </div>
            </div>

            {/* Compact Python Decision Reason Log Box - spaced out below cards */}
            {pythonReasoning && (
              <div className="w-full max-w-xl mt-3 sm:mt-4 p-2 sm:p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-xs font-mono text-slate-200 shadow-md">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5 border-b border-white/10 pb-0.5">
                  <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Python Decision Reason
                  </span>
                  <button
                    onClick={onOpenPythonPanel}
                    className="text-indigo-300 hover:text-white transition-colors cursor-pointer"
                  >
                    View Code Trace
                  </button>
                </div>
                <p className="text-slate-200 leading-snug text-[10px] sm:text-[11px] line-clamp-2">
                  {pythonReasoning}
                </p>
              </div>
            )}

            {/* Play Again / Start Fresh Series Button - spaced out with margin */}
            <div className="mt-3.5 sm:mt-5 flex items-center justify-center">
              <button
                id="play-again-btn"
                type="button"
                onClick={handlePlayAgain}
                className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer border ${
                  matchWinner
                    ? 'bg-amber-600 hover:bg-amber-500 border-amber-400/50 shadow-amber-500/25 ring-2 ring-amber-400/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400/40 shadow-indigo-500/25 ring-2 ring-indigo-400/20'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>{matchWinner ? 'Start Fresh Series' : 'Play Next Round'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Match Series Winner Banner at Bottom of Game Container */}
        {matchWinner && (
          <div className="relative mt-2 sm:mt-3 rounded-2xl p-[2.5px] overflow-hidden shadow-2xl z-20 shrink-0 w-full max-w-[38.5rem] mx-auto">
            {/* Rotating Laser Light Beam Background */}
            <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_200deg,#6366f1_260deg,#ec4899_300deg,#f59e0b_340deg,#38bdf8_360deg)] blur-[1px]" />

            {/* Static Inner Content Container */}
            <div className={`relative z-10 px-4 sm:px-5 py-2 sm:py-2.5 rounded-[13px] sm:rounded-[14px] backdrop-blur-2xl flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold border border-white/10 ${
              matchWinner === 'user' 
                ? 'bg-[#0f172a]/95 text-indigo-200' 
                : 'bg-[#0f172a]/95 text-pink-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-pulse shrink-0" />
                <span className="tracking-wide text-xs sm:text-sm font-bold">
                  {matchWinner === 'user' ? 'MATCH CHAMPION! You won the series!' : '🤖 COMPUTER WINS SERIES!'}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-extrabold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/40 shadow-sm">
                VICTORY
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
