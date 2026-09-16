import { Puzzle, PuzzleOption } from '../../types/game';

export function generateQuickMathPuzzle(difficulty: number): Puzzle {
  const type = Math.floor(Math.random() * 5);
  let question = '';
  let correctAnswer = 0;

  if (type === 0) {
    // Rapid Addition / Subtraction (e.g. 17 + 28)
    const a = 14 + Math.floor(Math.random() * 35);
    const b = 18 + Math.floor(Math.random() * 40);
    question = `${a}  +  ${b}`;
    correctAnswer = a + b;
  } else if (type === 1) {
    // Division / Multiplication (e.g. 64 ÷ 8, 13 × 7, 125 × 8)
    const subType = Math.floor(Math.random() * 3);
    if (subType === 0) {
      const b = 6 + Math.floor(Math.random() * 6);
      correctAnswer = 7 + Math.floor(Math.random() * 8);
      const a = b * correctAnswer;
      question = `${a}  ÷  ${b}`;
    } else if (subType === 1) {
      const a = 12 + Math.floor(Math.random() * 8);
      const b = 6 + Math.floor(Math.random() * 5);
      question = `${a}  ×  ${b}`;
      correctAnswer = a * b;
    } else {
      question = `125  ×  8`;
      correctAnswer = 1000;
    }
  } else if (type === 2) {
    // Percentages (e.g. 25% of 240)
    const pct = Math.random() > 0.5 ? 25 : 15;
    const base = pct === 25 ? 240 : 200;
    question = `${pct}%  of  ${base}`;
    correctAnswer = (pct / 100) * base;
  } else if (type === 3) {
    // Squares (e.g. 18^2, 14^2)
    const base = 12 + Math.floor(Math.random() * 7); // 12 to 18
    question = `${base}²`;
    correctAnswer = base * base;
  } else {
    // Profit/Loss or Fraction
    const cost = 200;
    const sell = 260;
    question = `Cost: $${cost}, Sale: $${sell}. Calculate Profit Percentage:`;
    correctAnswer = 30; // 60/200 = 30%
  }

  const options: PuzzleOption[] = [
    { id: 'c', label: type === 4 ? `${correctAnswer}%` : `${correctAnswer}`, value: correctAnswer, isCorrect: true },
    { id: 'd1', label: type === 4 ? `${correctAnswer + 5}%` : `${correctAnswer + 4}`, value: correctAnswer + 4 },
    { id: 'd2', label: type === 4 ? `${correctAnswer - 10}%` : `${correctAnswer - 6}`, value: correctAnswer - 6 },
    { id: 'd3', label: type === 4 ? `${correctAnswer + 15}%` : `${correctAnswer + 10}`, value: correctAnswer + 10 },
  ].sort(() => Math.random() - 0.5);

  return {
    id: `quick_math_${Date.now()}_${Math.random()}`,
    category: 'QUICK_MATH',
    title: 'RAPID MENTAL ARITHMETIC',
    description: 'Execute high-speed mental arithmetic before the reaction timer expires.',
    inputType: 'MULTIPLE_CHOICE',
    questionText: question,
    correctAnswer: correctAnswer,
    options,
    timeLimitSeconds: Math.max(3, 7 - difficulty * 0.4),
    difficulty,
    hint: 'Decompose numbers into tens and units for faster mental computation.',
    forgeDialogue: {
      intro: `FORGE: High-frequency arithmetic stream active. Compute instant evaluation.`,
      success: `FORGE: Mental calculation latency optimal.`,
      failure: `FORGE: Arithmetic calculation timeout or error.`,
    }
  };
}
