import { Puzzle, PuzzleOption } from '../../types/game';

export function generateLogicGridPuzzle(difficulty: number): Puzzle {
  const scenarios = [
    {
      q: 'Three operatives (Alpha, Beta, Gamma) work as Analyst, Engineer, and Pilot. Clues:\n1. Alpha does NOT fly planes.\n2. Beta is the Engineer.\n\nWho is the Pilot?',
      ans: 'Gamma is the Pilot (Alpha is Analyst, Beta is Engineer).',
      d1: 'Alpha is the Pilot',
      d2: 'Beta is the Pilot',
      d3: 'Cannot be determined',
      hint: 'If Beta is the Engineer, and Alpha does NOT fly, then Alpha must be the Analyst, leaving Gamma as the Pilot!'
    },
    {
      q: 'Three scientists (Dr. X, Dr. Y, Dr. Z) research Physics, Chemistry, and Biology. Clues:\n1. Dr. X does not study Biology.\n2. Dr. Z studies Physics.\n\nWhat does Dr. X study?',
      ans: 'Chemistry (Dr. Z = Physics, Dr. Y = Biology)',
      d1: 'Physics',
      d2: 'Biology',
      d3: 'Geology',
      hint: 'Z has Physics. Since X cannot have Biology, X must study Chemistry!'
    }
  ];

  const chosen = scenarios[Math.floor(Math.random() * scenarios.length)];

  const options: PuzzleOption[] = [
    { id: 'c', label: chosen.ans, value: chosen.ans, isCorrect: true },
    { id: 'd1', label: chosen.d1, value: chosen.d1 },
    { id: 'd2', label: chosen.d2, value: chosen.d2 },
    { id: 'd3', label: chosen.d3, value: chosen.d3 },
  ].sort(() => Math.random() - 0.5);

  return {
    id: `logic_grid_${Date.now()}_${Math.random()}`,
    category: 'LOGIC_GRID',
    title: 'LOGICAL DEDUCTION MATRIX',
    description: 'Use the elimination clues to solve the multi-attribute deduction grid.',
    inputType: 'MULTIPLE_CHOICE',
    questionText: chosen.q,
    correctAnswer: chosen.ans,
    options,
    timeLimitSeconds: Math.max(10, 18 - difficulty),
    difficulty,
    hint: chosen.hint,
    forgeDialogue: {
      intro: `FORGE: Logic matrix elimination grid initialized. Cross-reference clues.`,
      success: `FORGE: Deduction matrix resolved cleanly. Zero logical errors.`,
      failure: `FORGE: Logical deduction error in elimination matrix.`,
    }
  };
}
