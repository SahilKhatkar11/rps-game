export type Move = 'rock' | 'paper' | 'scissors';

export type GameOutcome = 'win' | 'lose' | 'tie';

export type AIStrategy = 'random' | 'counter' | 'markov' | 'weighted';

export interface RoundRecord {
  id: string;
  roundNumber: number;
  userMove: Move;
  computerMove: Move;
  outcome: GameOutcome;
  timestamp: number;
  strategyUsed: AIStrategy;
  reasoning?: string;
}

export interface GameStats {
  userWins: number;
  computerWins: number;
  ties: number;
  totalRounds: number;
  currentStreak: number;
  bestStreak: number;
}

export interface MatchConfig {
  targetScore: number | null; // e.g. 3 for Best of 5, null for Endless
  strategy: AIStrategy;
  soundEnabled: boolean;
  fastAnimation: boolean;
}
