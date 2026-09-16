import { Puzzle, PuzzleOption } from '../../types/game';

const COLORS_DATA = [
  { name: 'CYAN', colorHex: '#00f3ff' },
  { name: 'PURPLE', colorHex: '#a855f7' },
  { name: 'RED', colorHex: '#ef4444' },
  { name: 'GREEN', colorHex: '#10b981' },
  { name: 'YELLOW', colorHex: '#f59e0b' },
];

export function generateSpeedPuzzle(difficulty: number): Puzzle {
  const isStroop = Math.random() > 0.4;

  if (isStroop) {
    // Stroop Effect Test
    const targetMode = Math.random() > 0.5 ? 'INK_COLOR' : 'TEXT_WORD';
    const wordData = COLORS_DATA[Math.floor(Math.random() * COLORS_DATA.length)];
    
    let inkData = COLORS_DATA[Math.floor(Math.random() * COLORS_DATA.length)];
    while (inkData.name === wordData.name) {
      inkData = COLORS_DATA[Math.floor(Math.random() * COLORS_DATA.length)];
    }

    const question = targetMode === 'INK_COLOR' 
      ? `REACT QUICKLY: Select the INK COLOR of the word below (Ignore the word text!)`
      : `REACT QUICKLY: Select the TEXT WORD below (Ignore the ink color!)`;

    const correctAnswer = targetMode === 'INK_COLOR' ? inkData.name : wordData.name;

    const options: PuzzleOption[] = COLORS_DATA.map(c => ({
      id: `opt_${c.name}`,
      label: c.name,
      value: c.name,
      isCorrect: c.name === correctAnswer,
    })).sort(() => Math.random() - 0.5);

    return {
      id: `speed_stroop_${Date.now()}_${Math.random()}`,
      category: 'SPEED',
      title: targetMode === 'INK_COLOR' ? 'STROOP INK IMPULSE TEST' : 'STROOP SEMANTIC REFLEX',
      description: question,
      inputType: 'SPEED_TARGET',
      questionText: wordData.name,
      correctAnswer: correctAnswer,
      options,
      timeLimitSeconds: Math.max(3, 7 - difficulty * 0.4),
      difficulty,
      hint: targetMode === 'INK_COLOR' ? 'Blur your visual focus slightly to suppress reading text automaticity.' : 'Focus on text orthography only.',
      forgeDialogue: {
        intro: `FORGE: Stroop interference field engaged. Override automatic cognitive reflex!`,
        success: `FORGE: Cognitive suppression speed optimal. Reflex reaction latency low.`,
        failure: `FORGE: Stroop trap sprung. Reflex failure under pressure.`,
      },
      metadata: {
        targetMode,
        wordText: wordData.name,
        inkHex: inkData.colorHex,
      }
    };
  } else {
    // Target vs Distractor Filter
    const targetSymbol = '★';
    const distractors = ['▲', '■', '●', '◆', '✚', '✖'];

    const items: string[] = [];
    const itemCount = Math.min(12, 6 + Math.floor(difficulty * 0.8));
    const targetCount = 1 + Math.floor(Math.random() * 3);

    for (let i = 0; i < targetCount; i++) items.push(targetSymbol);
    while (items.length < itemCount) {
      items.push(distractors[Math.floor(Math.random() * distractors.length)]);
    }

    items.sort(() => Math.random() - 0.5);

    return {
      id: `speed_target_${Date.now()}_${Math.random()}`,
      category: 'SPEED',
      title: 'RAPID TARGET INTERCEPTION',
      description: `Count how many STAR (★) symbols appear among the active distractors.`,
      inputType: 'MULTIPLE_CHOICE',
      questionText: items.join('   '),
      correctAnswer: targetCount,
      options: [1, 2, 3, 4].map(n => ({ id: `n_${n}`, label: `${n} Stars`, value: n })),
      timeLimitSeconds: Math.max(3, 6 - difficulty * 0.3),
      difficulty,
      hint: 'Scan systematically from top-left to bottom-right without back-tracking.',
      forgeDialogue: {
        intro: `FORGE: Distractor barrage deployed. Intercept target signatures immediately.`,
        success: `FORGE: Interception complete. Reaction speed within elite envelope.`,
        failure: `FORGE: Target count error. Visual scanning too slow.`,
      }
    };
  }
}
