import { Move, GameOutcome, AIStrategy, RoundRecord } from '../types';

export const WINNING_RULES: Record<Move, Move[]> = {
  rock: ['scissors'],
  paper: ['rock'],
  scissors: ['paper'],
};

export const MOVE_DETAILS: Record<Move, { name: string; emoji: string; beats: string; iconName: string; color: string; bg: string; neonColor: string; textColor: string }> = {
  rock: {
    name: 'Rock',
    emoji: '🪨',
    beats: 'Crushes Scissors',
    iconName: 'Gem',
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
    neonColor: '#ff2a85',
    textColor: 'text-pink-400',
  },
  paper: {
    name: 'Paper',
    emoji: '📄',
    beats: 'Covers Rock',
    iconName: 'FileText',
    color: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    neonColor: '#00d2ff',
    textColor: 'text-sky-400',
  },
  scissors: {
    name: 'Scissors',
    emoji: '✂️',
    beats: 'Cuts Paper',
    iconName: 'Scissors',
    color: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    neonColor: '#ffc800',
    textColor: 'text-yellow-400',
  },
};

export const PYTHON_SOURCE_CODE: Record<AIStrategy, string> = {
  random: `import random

def get_computer_choice():
    choices = ['rock', 'paper', 'scissors']
    return random.choice(choices)

def determine_winner(user_choice, computer_choice):
    if user_choice == computer_choice:
        return 'tie'
    
    rules = {
        'rock': ['scissors'],
        'paper': ['rock'],
        'scissors': ['paper']
    }
    
    if computer_choice in rules[user_choice]:
        return 'win'
    return 'lose'
`,
  counter: `# Counter-Strategy Python Bot
import random
from collections import Counter

def counter_pick(move):
    counters = {'rock': 'paper', 'paper': 'scissors', 'scissors': 'rock'}
    return counters.get(move, 'rock')

def get_computer_choice(history):
    if not history:
        return random.choice(['rock', 'paper', 'scissors'])
    
    # Analyze player's most frequent move
    user_moves = [h['userMove'] for h in history]
    most_common = Counter(user_moves).most_common(1)[0][0]
    
    # Play the move that counters player's favorite move
    return counter_pick(most_common)
`,
  markov: `# Markov Chain Predictive Python Bot
import random

def get_computer_choice(history):
    if len(history) < 2:
        return random.choice(['rock', 'paper', 'scissors'])
    
    # Build transition matrix P(next_move | current_move)
    transitions = {}
    for i in range(len(history) - 1):
        prev = history[i]['userMove']
        curr = history[i+1]['userMove']
        if prev not in transitions:
            transitions[prev] = []
        transitions[prev].append(curr)
    
    last_user_move = history[-1]['userMove']
    if last_user_move in transitions and transitions[last_user_move]:
        predicted = random.choice(transitions[last_user_move])
        counters = {'rock': 'paper', 'paper': 'scissors', 'scissors': 'rock'}
        return counters.get(predicted, 'paper')
    
    return random.choice(['rock', 'paper', 'scissors'])
`,
  weighted: `# Weighted Recency Python Bot
import random

def get_computer_choice(history):
    if not history:
        return random.choice(['rock', 'paper', 'scissors'])
    
    weights = {'rock': 1, 'paper': 1, 'scissors': 1}
    for idx, round_data in enumerate(reversed(history[-10:])):
        decay = 1 / (idx + 1)
        weights[round_data['userMove']] += decay
    
    predicted_user_move = max(weights, key=weights.get)
    counters = {'rock': 'paper', 'paper': 'scissors', 'scissors': 'rock'}
    return counters.get(predicted_user_move, 'rock')
`
};

export function evaluateWinner(userMove: Move, computerMove: Move): GameOutcome {
  if (userMove === computerMove) return 'tie';
  const beatableMoves = WINNING_RULES[userMove] || [];
  if (beatableMoves.includes(computerMove)) {
    return 'win';
  }
  return 'lose';
}

export function generateComputerChoice(
  strategy: AIStrategy,
  history: RoundRecord[]
): { choice: Move; reasoning: string; pythonTrace: string[] } {
  const availableMoves: Move[] = ['rock', 'paper', 'scissors'];

  const traceLogs: string[] = [];
  traceLogs.push(`>>> python -c "import rps_engine; rps_engine.get_choice('${strategy}')"`);

  let chosenMove: Move = 'rock';
  let reasoning = '';

  if (strategy === 'random' || history.length === 0) {
    const idx = Math.floor(Math.random() * availableMoves.length);
    chosenMove = availableMoves[idx];
    reasoning = `Python random.choice() picked '${chosenMove}' uniformly.`;
    traceLogs.push(`[Python Math] selected index = ${idx} -> '${chosenMove}'`);
  } else if (strategy === 'counter') {
    const userMoves = history.map(h => h.userMove);
    const counts: Record<string, number> = {};
    userMoves.forEach(m => { counts[m] = (counts[m] || 0) + 1; });
    
    let maxMove: Move = availableMoves[0];
    let maxCount = -1;
    Object.entries(counts).forEach(([m, cnt]) => {
      if (cnt > maxCount && availableMoves.includes(m as Move)) {
        maxCount = cnt;
        maxMove = m as Move;
      }
    });

    const counterMap: Record<Move, Move> = {
      rock: 'paper',
      paper: 'scissors',
      scissors: 'rock',
    };

    chosenMove = counterMap[maxMove] || 'paper';
    reasoning = `Counter Strategy: Player mostly played '${maxMove}' (${maxCount}x). Counter is '${chosenMove}'.`;
    traceLogs.push(`[Python Analytics] User move frequencies: ${JSON.stringify(counts)}`);
    traceLogs.push(`[Python Decision] Player favorite = '${maxMove}', countering with '${chosenMove}'`);
  } else if (strategy === 'markov') {
    if (history.length >= 2) {
      const transitions: Record<string, string[]> = {};
      for (let i = 0; i < history.length - 1; i++) {
        const prev = history[i].userMove;
        const curr = history[i + 1].userMove;
        if (!transitions[prev]) transitions[prev] = [];
        transitions[prev].push(curr);
      }

      const lastUserMove = history[history.length - 1].userMove;
      const nextProbables = transitions[lastUserMove];

      if (nextProbables && nextProbables.length > 0) {
        const predictedUserNext = nextProbables[Math.floor(Math.random() * nextProbables.length)] as Move;
        const counterMap: Record<Move, Move> = {
          rock: 'paper', paper: 'scissors', scissors: 'rock'
        };
        chosenMove = counterMap[predictedUserNext] || 'rock';
        reasoning = `Markov Chain: After '${lastUserMove}', player historically picked '${predictedUserNext}'. Countering with '${chosenMove}'.`;
        traceLogs.push(`[Markov Model] Last move = '${lastUserMove}'`);
        traceLogs.push(`[Markov Model] Transition options: ${JSON.stringify(nextProbables)}`);
        traceLogs.push(`[Markov Prediction] Target: '${predictedUserNext}' -> Counter: '${chosenMove}'`);
      } else {
        chosenMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        reasoning = `Markov fallback: No prior transition state recorded for '${lastUserMove}'. Picked random.`;
      }
    } else {
      chosenMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      reasoning = `Markov initial round: Need at least 2 rounds. Picked random.`;
    }
  } else {
    // Weighted
    const weights: Record<string, number> = { rock: 1, paper: 1, scissors: 1 };
    const recent = history.slice(-10).reverse();
    recent.forEach((item, idx) => {
      const decay = 1 / (idx + 1);
      weights[item.userMove] = (weights[item.userMove] || 1) + decay;
    });

    let highestWeightMove: Move = 'rock';
    let maxW = 0;
    availableMoves.forEach(m => {
      if (weights[m] > maxW) {
        maxW = weights[m];
        highestWeightMove = m;
      }
    });

    const counterMap: Record<Move, Move> = {
      rock: 'paper', paper: 'scissors', scissors: 'rock'
    };
    chosenMove = counterMap[highestWeightMove] || 'paper';
    reasoning = `Weighted Recency: Favors predicted move '${highestWeightMove}'. Countering with '${chosenMove}'.`;
  }

  traceLogs.push(`[Python Execution Success] Return code: 0, Output: '${chosenMove}'`);

  return {
    choice: chosenMove,
    reasoning,
    pythonTrace: traceLogs
  };
}
