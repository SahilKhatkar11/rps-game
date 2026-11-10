import React from 'react';
import { Move } from '../types';
import { MOVE_DETAILS } from '../utils/pythonEngine';
import { NeonMoveIcon } from './NeonMoveIcon';

interface MoveCardProps {
  move: Move;
  shortcutKey: string;
  isSelected?: boolean;
  disabled?: boolean;
  onClick: (move: Move) => void;
}

const THEME_STYLES: Record<
  Move,
  {
    selected: string;
    normal: string;
    labelColor: string;
    subLabel: string;
  }
> = {
  rock: {
    selected: 'bg-pink-500/20 border-pink-400 ring-2 ring-pink-400/40 shadow-xl shadow-pink-500/25',
    normal: 'hover:border-pink-500/50 hover:shadow-pink-500/15 hover:bg-pink-500/10',
    labelColor: 'text-pink-400 drop-shadow-[0_0_4px_rgba(255,42,133,0.5)]',
    subLabel: 'Crushes Scissors',
  },
  paper: {
    selected: 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-400/40 shadow-xl shadow-sky-500/25',
    normal: 'hover:border-sky-500/50 hover:shadow-sky-500/15 hover:bg-sky-500/10',
    labelColor: 'text-sky-400 drop-shadow-[0_0_4px_rgba(0,210,255,0.5)]',
    subLabel: 'Covers Rock',
  },
  scissors: {
    selected: 'bg-yellow-500/20 border-yellow-400 ring-2 ring-yellow-400/40 shadow-xl shadow-yellow-500/25',
    normal: 'hover:border-yellow-500/50 hover:shadow-yellow-500/15 hover:bg-yellow-500/10',
    labelColor: 'text-yellow-400 drop-shadow-[0_0_4px_rgba(255,200,0,0.5)]',
    subLabel: 'Cuts Paper',
  },
};

export const MoveCard: React.FC<MoveCardProps> = ({
  move,
  shortcutKey,
  isSelected,
  disabled,
  onClick,
}) => {
  const details = MOVE_DETAILS[move];
  const theme = THEME_STYLES[move];

  return (
    <button
      type="button"
      id={`move-btn-${move}`}
      disabled={disabled}
      onClick={() => onClick(move)}
      className={`group relative flex flex-col items-center justify-between p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 select-none cursor-pointer text-center min-h-[7rem] sm:min-h-[9.375rem] md:min-h-[11rem] min-w-0 bg-[#0c1222]/90 backdrop-blur-xl border-white/15 ${
        isSelected ? theme.selected + ' scale-105' : theme.normal + ' hover:scale-105 active:scale-95'
      } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
    >
      {/* Keyboard shortcut badge */}
      <span className="absolute top-2 right-2.5 sm:top-3 sm:right-3.5 text-[9px] sm:text-[11px] font-mono px-1.5 sm:px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-slate-300 group-hover:text-white transition-colors">
        {shortcutKey}
      </span>

      {/* Neon Icon replacing old emoji - enlarged */}
      <div className="my-1 sm:my-2 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
        <NeonMoveIcon move={move} size="xl" glow={true} />
      </div>

      {/* Name and description */}
      <div className="w-full mt-1 sm:mt-1.5">
        <h3 className="w-full flex items-center justify-center">
          <span className={`text-xs sm:text-sm md:text-base font-black uppercase font-brand-title font-stretched-neon ${theme.labelColor}`}>
            {details.name}
          </span>
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-300/80 truncate mt-0.5 sm:mt-1 max-w-[140px] mx-auto group-hover:text-white font-medium">
          {details.beats}
        </p>
      </div>

      {/* Subtle selection ring indicator */}
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-white/50 animate-ping pointer-events-none opacity-20" />
      )}
    </button>
  );
};
