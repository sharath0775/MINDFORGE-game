import { Puzzle, PuzzleOption } from '../../types/game';

export function generateDecisionPuzzle(difficulty: number): Puzzle {
  const scenarios = [
    {
      title: 'QUANTUM PROTOCOL STRATEGY',
      desc: 'Facility power core is fluctuating at 85% capacity. Choose your energy routing strategy:',
      options: [
        { id: 'o1', label: 'Route 100% to Defense (Safe: +300 pts guaranteed)', value: 'SAFE', points: 300, isCorrect: true },
        { id: 'o2', label: 'Route 50% Defense / 50% Overclock (Calculated Risk: +500 pts at 80% probability)', value: 'BALANCED', points: 500, isCorrect: true },
        { id: 'o3', label: 'Route 100% Overclock (High Yield: +900 pts at 40% probability)', value: 'RISKY', points: 400, isCorrect: true },
      ],
      hint: 'Expected value calculation: Safe = 300; Balanced = 0.8 * 500 = 400; Risky = 0.4 * 900 = 360. Balanced yields highest expected value!'
    },
    {
      title: 'DATA CORRUPTION TRIAGE',
      desc: 'Three critical facility archives are purging in 5 seconds. You can only save ONE node completely or TWO partially:',
      options: [
        { id: 'o1', label: 'Save Archive Alpha (100% Core Neural Data — Yields +450 pts)', value: 'ALPHA', points: 450, isCorrect: true },
        { id: 'o2', label: 'Save Archive Beta & Gamma (50% Data each — Combined Yield +380 pts)', value: 'BETA_GAMMA', points: 380, isCorrect: true },
        { id: 'o3', label: 'Attempt Master Recovery Hack (50% Chance of +750 pts / 50% Chance of 0 pts)', value: 'HACK', points: 375, isCorrect: true },
      ],
      hint: 'Alpha offers guaranteed 450 pts vs Beta/Gamma (380) vs Hack expected value (375).'
    },
    {
      title: 'DEFENSIVE GRID ALLOCATION',
      desc: 'Cyber intrusion detected across two entry vectors: Firewall (V1) and Database (V2). Your security shields are limited.',
      options: [
        { id: 'o1', label: 'Reinforce Database (Defends high-value asset, +420 pts)', value: 'DB', points: 420, isCorrect: true },
        { id: 'o2', label: 'Split Shields Equally (Prevents complete breach, +350 pts)', value: 'SPLIT', points: 350, isCorrect: true },
        { id: 'o3', label: 'Counter-Attack Intruder (Aggressive gamble, +600 pts if successful)', value: 'COUNTER', points: 300, isCorrect: true },
      ],
      hint: 'Securing the Database guarantees maximum deterministic return.'
    }
  ];

  const chosen = scenarios[Math.floor(Math.random() * scenarios.length)];

  // All choices are valid, but yield different score outcomes
  const bestChoice = chosen.options.reduce((prev, curr) => (curr.points > prev.points ? curr : prev));

  const options: PuzzleOption[] = chosen.options.map(o => ({
    id: o.id,
    label: `${o.label}`,
    value: o.value,
    isCorrect: o.value === bestChoice.value,
  })).sort(() => Math.random() - 0.5);

  return {
    id: `dec_strat_${Date.now()}_${Math.random()}`,
    category: 'DECISION',
    title: chosen.title,
    description: chosen.desc,
    inputType: 'MULTIPLE_CHOICE',
    questionText: 'Select the optimal strategic decision under uncertainty:',
    correctAnswer: bestChoice.value,
    options,
    timeLimitSeconds: Math.max(10, 18 - difficulty),
    difficulty,
    hint: chosen.hint,
    forgeDialogue: {
      intro: `FORGE: Strategic dilemma initiated. Evaluate expected return under time pressure.`,
      success: `FORGE: Optimal decision executed. Strategic judgment score maximized.`,
      failure: `FORGE: Sub-optimal trade-off selected. Expected utility compromised.`,
    },
    metadata: {
      optionsDetail: chosen.options
    }
  };
}
