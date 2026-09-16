import { Puzzle, PuzzleOption } from '../../types/game';

export function generatePsychologyPuzzle(difficulty: number): Puzzle {
  const traps = [
    {
      title: 'THE MONTY HALL CYBER PARADOX',
      q: 'You are presented with 3 digital doors. Behind ONE is the Master Key; behind the other two are empty voids. You pick Door #1. FORGE opens Door #3, showing it is empty. FORGE asks: "Do you want to switch to Door #2?" What is the mathematically optimal choice?',
      ans: 'SWITCH to Door #2 (Winning probability increases from 1/3 to 2/3).',
      d1: 'STAY with Door #1 (Probability remains 50/50 regardless).',
      d2: 'It makes ZERO difference (Both remaining doors have identical 50% odds).',
      d3: 'RE-ROLL both doors.',
      hint: 'Your initial choice had a 1/3 chance of being right. The remaining 2/3 probability consolidates into Door #2 once FORGE reveals Door #3 is empty!'
    },
    {
      title: 'GAMBLER\'S FALLACY ILLUSION',
      q: 'A quantum coin has landed on RED 7 times in a row. What is the probability of it landing on BLACK on the 8th flip?',
      ans: 'Exactly 50% (Flips are independent events).',
      d1: 'Greater than 50% (Black is "due" to balance the average).',
      d2: 'Less than 50% (Red is on a streak and more likely).',
      d3: '100% Guaranteed Black.',
      hint: 'Past independent trials have zero physical influence on subsequent quantum coin tosses.'
    },
    {
      title: 'THE BAT & BALL PRICING TRAP',
      q: 'A Cyber-Key and an Access-Badge cost $1.10 in total. The Cyber-Key costs $1.00 MORE than the Access-Badge. How much does the Access-Badge cost?',
      ans: '$0.05 (5 Cents)',
      d1: '$0.10 (10 Cents)',
      d2: '$1.00 (1 Dollar)',
      d3: '$0.15 (15 Cents)',
      hint: 'If Badge = $0.10, then Key = $1.10, making total = $1.20! Correct system: Key = $1.05, Badge = $0.05.'
    },
    {
      title: 'LILY PAD EXPONENTIAL DUPING',
      q: 'Digital malware spreads across a server grid. The corrupted area DOUBLES in size every day. If it takes 48 days to corrupt the ENTIRE grid, how long does it take to corrupt HALF the grid?',
      ans: '47 Days',
      d1: '24 Days',
      d2: '12 Days',
      d3: '46 Days',
      hint: 'Since it doubles every single day, working backward from day 48 (100%) means day 47 was exactly 50%!'
    }
  ];

  const chosen = traps[Math.floor(Math.random() * traps.length)];

  const options: PuzzleOption[] = [
    { id: 'c', label: chosen.ans, value: chosen.ans, isCorrect: true },
    { id: 'd1', label: chosen.d1, value: chosen.d1 },
    { id: 'd2', label: chosen.d2, value: chosen.d2 },
    { id: 'd3', label: chosen.d3, value: chosen.d3 },
  ].sort(() => Math.random() - 0.5);

  return {
    id: `psy_trap_${Date.now()}_${Math.random()}`,
    category: 'PSYCHOLOGY',
    title: chosen.title,
    description: 'COGNITIVE BIAS TRAP: Your automatic System-1 brain will attempt to force a wrong intuitive response.',
    inputType: 'MULTIPLE_CHOICE',
    questionText: chosen.q,
    correctAnswer: chosen.ans,
    options,
    timeLimitSeconds: Math.max(12, 22 - difficulty * 1.5),
    difficulty: Math.max(5, difficulty),
    hint: chosen.hint,
    forgeDialogue: {
      intro: `FORGE: Cognitive bias trap deployed. Disengage primitive intuitive shortcuts!`,
      success: `FORGE: Remarkable. Analytical System-2 overrides intuitive fallacy.`,
      failure: `FORGE: Cognitive bias exploited! Your brain chose the intuitive trap.`,
    }
  };
}
