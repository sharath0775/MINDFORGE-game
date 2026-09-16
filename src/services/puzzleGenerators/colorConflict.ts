import { Puzzle, PuzzleOption } from '../../types/game';

const COLORS = [
  { name: 'RED', hex: '#ef4444' },
  { name: 'BLUE', hex: '#3b82f6' },
  { name: 'GREEN', hex: '#10b981' },
  { name: 'YELLOW', hex: '#f59e0b' },
  { name: 'PURPLE', hex: '#a855f7' },
];

export function generateColorConflictPuzzle(difficulty: number): Puzzle {
  const wordObj = COLORS[Math.floor(Math.random() * COLORS.length)];
  let inkObj = COLORS[Math.floor(Math.random() * COLORS.length)];
  while (inkObj.name === wordObj.name) {
    inkObj = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  const question = `Select the INK COLOR of the word below (Ignore what the word text says!)`;
  const correctAnswer = inkObj.name;

  const options: PuzzleOption[] = COLORS.map(c => ({
    id: `col_${c.name}`,
    label: c.name,
    value: c.name,
    isCorrect: c.name === correctAnswer,
  })).sort(() => Math.random() - 0.5);

  return {
    id: `color_conf_${Date.now()}_${Math.random()}`,
    category: 'COLOR_CONFLICT',
    title: 'STROOP COLOR INK CONFLICT',
    description: question,
    inputType: 'SPEED_TARGET',
    questionText: wordObj.name,
    correctAnswer: correctAnswer,
    options,
    timeLimitSeconds: Math.max(2.5, 6 - difficulty * 0.4),
    difficulty,
    hint: 'Suppress automatic semantic reading to focus exclusively on optical ink hue.',
    forgeDialogue: {
      intro: `FORGE: Stroop interference active! Select optical ink color, not text semantics.`,
      success: `FORGE: Semantic interference overridden cleanly.`,
      failure: `FORGE: Stroop cognitive trap triggered. Text semantics misdirected reaction.`,
    },
    metadata: {
      wordText: wordObj.name,
      inkHex: inkObj.hex,
    }
  };
}
