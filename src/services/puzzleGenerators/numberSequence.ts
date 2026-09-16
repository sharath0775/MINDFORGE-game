import { Puzzle, PuzzleOption } from '../../types/game';

export function generateNumberSequencePuzzle(difficulty: number): Puzzle {
  const type = Math.floor(Math.random() * 4);
  let series: number[] = [];
  let nextVal = 0;
  let ruleDesc = '';

  if (type === 0) {
    // Multi-step quadratic sequence (n^2 + k)
    const k = 1 + Math.floor(Math.random() * 5);
    for (let i = 1; i <= 5; i++) {
      series.push(i * i + k);
    }
    nextVal = 6 * 6 + k;
    ruleDesc = `n² + ${k}`;
  } else if (type === 1) {
    // Geometric growth with offset (x2 + 3)
    const add = 1 + Math.floor(Math.random() * 3);
    let curr = 3;
    series.push(curr);
    for (let i = 0; i < 4; i++) {
      curr = curr * 2 + add;
      series.push(curr);
    }
    nextVal = curr * 2 + add;
    ruleDesc = `(x2) + ${add}`;
  } else if (type === 2) {
    // Alternating Dual Sequence
    const step1 = 4 + Math.floor(Math.random() * 3);
    const step2 = -3;
    let a = 12;
    let b = 40;
    series = [a, b, a + step1, b + step2, a + step1 * 2, b + step2 * 2];
    nextVal = a + step1 * 3;
    ruleDesc = `Interleaved +${step1} / ${step2}`;
  } else {
    // Fibonacci derivative multiplier
    const m = 2;
    series = [1, 2, 3, 5, 8, 13];
    series = series.map(n => n * m);
    nextVal = 21 * m;
    ruleDesc = 'Fibonacci x 2';
  }

  const question = `${series.join(',  ')},  [ ? ]`;
  const correctAnswer = nextVal;

  const options: PuzzleOption[] = [
    { id: 'c', label: `${correctAnswer}`, value: correctAnswer, isCorrect: true },
    { id: 'd1', label: `${correctAnswer + 2}`, value: correctAnswer + 2 },
    { id: 'd2', label: `${correctAnswer - 3}`, value: correctAnswer - 3 },
    { id: 'd3', label: `${correctAnswer + 7}`, value: correctAnswer + 7 },
  ].sort(() => Math.random() - 0.5);

  return {
    id: `num_seq_${Date.now()}_${Math.random()}`,
    category: 'NUMBER_SEQUENCE',
    title: 'ADVANCED NUMERICAL SEQUENCE',
    description: 'Deduce the non-linear mathematical rule governing the term progression.',
    inputType: 'MULTIPLE_CHOICE',
    questionText: question,
    correctAnswer: correctAnswer,
    options,
    timeLimitSeconds: Math.max(10, 18 - difficulty),
    difficulty,
    hint: `Rule pattern: ${ruleDesc}. Check first-order and second-order differences.`,
    forgeDialogue: {
      intro: `FORGE: Number sequence algorithm loaded. Extrapolate terminal node value.`,
      success: `FORGE: Numerical extrapolation precise. Rule algorithm confirmed.`,
      failure: `FORGE: Extrapolation error. Numerical sequence rule miscalculated.`,
    }
  };
}
