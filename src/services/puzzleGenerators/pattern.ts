import { Puzzle, PuzzleOption } from '../../types/game';

export function generatePatternPuzzle(difficulty: number): Puzzle {
  const type = Math.floor(Math.random() * 3);

  if (type === 0) {
    // Number Series Progression
    let series: number[] = [];
    let nextVal: number = 0;
    let ruleDesc = '';

    const subType = Math.floor(Math.random() * 4);
    if (subType === 0) {
      // Alternating add / multiply
      const add = 2 + Math.floor(Math.random() * 4);
      const mult = 2;
      let curr = 2 + Math.floor(Math.random() * 3);
      series.push(curr);
      for (let i = 0; i < 4; i++) {
        if (i % 2 === 0) curr = curr + add;
        else curr = curr * mult;
        series.push(curr);
      }
      nextVal = (series.length - 1) % 2 === 0 ? series[series.length - 1] * mult : series[series.length - 1] + add;
      ruleDesc = `Alternating +${add} and x${mult}`;
    } else if (subType === 1) {
      // Fibonacci offset
      const start = 1 + Math.floor(Math.random() * 5);
      const k = 1 + Math.floor(Math.random() * 3);
      series = [start, start + k, start + start + k];
      for (let i = 3; i < 5; i++) {
        series.push(series[i - 1] + series[i - 2]);
      }
      nextVal = series[series.length - 1] + series[series.length - 2];
      ruleDesc = 'Fibonacci summation derivative';
    } else if (subType === 2) {
      // Square minus offset
      const offset = Math.floor(Math.random() * 3) + 1;
      for (let i = 2; i <= 6; i++) {
        series.push(i * i - offset);
      }
      nextVal = 7 * 7 - offset;
      ruleDesc = `n² - ${offset}`;
    } else {
      // Dual interleaved sequences (A, B, A', B'...)
      const stepA = 3 + Math.floor(Math.random() * 3);
      const stepB = -2 - Math.floor(Math.random() * 2);
      let a = 10;
      let b = 50;
      series = [a, b, a + stepA, b + stepB, a + stepA * 2, b + stepB * 2];
      nextVal = a + stepA * 3;
      ruleDesc = 'Interleaved dual progressions';
    }

    const question = `${series.join(',  ')},  [ ? ]`;
    const correctAnswer = nextVal;
    
    // Distractors
    const options: PuzzleOption[] = [
      { id: 'correct', label: `${correctAnswer}`, value: correctAnswer, isCorrect: true },
      { id: 'd1', label: `${correctAnswer + (Math.random() > 0.5 ? 2 : -2)}`, value: correctAnswer + 2 },
      { id: 'd2', label: `${correctAnswer + (Math.random() > 0.5 ? 5 : -4)}`, value: correctAnswer + 5 },
      { id: 'd3', label: `${correctAnswer * 2 - series[0]}`, value: correctAnswer * 2 - series[0] }
    ]
    .filter((opt, index, self) => self.findIndex(o => o.value === opt.value) === index)
    .sort(() => Math.random() - 0.5);

    return {
      id: `pat_num_${Date.now()}_${Math.random()}`,
      category: 'PATTERN',
      title: 'NUMERICAL SYMMETRY EXTRAPOLATION',
      description: 'Analyze the mathematical progression sequence and identify the next node.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: question,
      correctAnswer: correctAnswer,
      options,
      timeLimitSeconds: Math.max(10, 20 - difficulty * 1.2),
      difficulty,
      hint: `Look for secondary differences between adjacent terms or dual alternating rules (${ruleDesc}).`,
      forgeDialogue: {
        intro: `FORGE: Numerical anomaly array initialized. Deduce governing algorithm.`,
        success: `FORGE: Algorithmic progression identified accurately.`,
        failure: `FORGE: Mathematical extrapolation error. Pattern misread.`,
      }
    };
  } else if (type === 1) {
    // Symbol Rotation Matrix
    const shapes = ['▲', '▶', '▼', '◀'];
    const colors = ['Cyan', 'Purple', 'Gold', 'Emerald'];
    
    const startShapeIdx = Math.floor(Math.random() * shapes.length);
    const startColorIdx = Math.floor(Math.random() * colors.length);
    const shapeRotationStep = Math.random() > 0.5 ? 1 : 3; // +90deg or -90deg
    
    const seq = [0, 1, 2, 3].map(i => {
      const s = shapes[(startShapeIdx + i * shapeRotationStep) % shapes.length];
      const c = colors[(startColorIdx + i) % colors.length];
      return `${c} ${s}`;
    });

    const question = `${seq.slice(0, 3).join('   →   ')}   →   [ ? ]`;
    const correctAnswer = seq[3];

    const distractor1 = `${colors[(startColorIdx + 3) % colors.length]} ${shapes[(startShapeIdx + 2) % shapes.length]}`;
    const distractor2 = `${colors[(startColorIdx + 2) % colors.length]} ${shapes[(startShapeIdx + 3) % shapes.length]}`;
    const distractor3 = `${colors[startColorIdx]} ${shapes[(startShapeIdx + 1) % shapes.length]}`;

    const options: PuzzleOption[] = [
      { id: 'c', label: correctAnswer, value: correctAnswer, isCorrect: true },
      { id: 'd1', label: distractor1, value: distractor1 },
      { id: 'd2', label: distractor2, value: distractor2 },
      { id: 'd3', label: distractor3, value: distractor3 },
    ].sort(() => Math.random() - 0.5);

    return {
      id: `pat_sym_${Date.now()}_${Math.random()}`,
      category: 'PATTERN',
      title: 'QUANTUM SPATIAL ROTATION',
      description: 'Determine the missing glyph by combining directional spatial rotation and color cycle logic.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: question,
      correctAnswer: correctAnswer,
      options,
      timeLimitSeconds: Math.max(8, 16 - difficulty),
      difficulty,
      hint: 'Track shape rotation direction (+90°) independently from the color order cycle.',
      forgeDialogue: {
        intro: `FORGE: Spatial tensor field active. Calculate terminal matrix state.`,
        success: `FORGE: Tensor vector aligned. High spatial acuity confirmed.`,
        failure: `FORGE: Vector miscalculation. Spatial drift detected.`,
      }
    };
  } else {
    // Deceptive Intuition Trap Pattern
    const question = '2,  4,  8,  16,  31,  63,  [ ? ]';
    const correctAnswer = 127;
    const deceptiveDistractor = 128; // Intuitive 2^n jump, but formula is 2^n - 1 after index 4!

    const options: PuzzleOption[] = [
      { id: 'opt_127', label: '127', value: 127, isCorrect: true },
      { id: 'opt_128', label: '128 (Intuitive Trap)', value: 128 },
      { id: 'opt_126', label: '126', value: 126 },
      { id: 'opt_125', label: '125', value: 125 }
    ].sort(() => Math.random() - 0.5);

    return {
      id: `pat_trap_${Date.now()}_${Math.random()}`,
      category: 'PATTERN',
      title: 'DECEPTIVE REGRESSION TRAP',
      description: 'BEWARE: The obvious pattern is designed to exploit cognitive shortcuts. Verify exact deltas!',
      inputType: 'MULTIPLE_CHOICE',
      questionText: question,
      correctAnswer: 127,
      options,
      timeLimitSeconds: Math.max(10, 15 - difficulty),
      difficulty: Math.max(6, difficulty),
      hint: 'Notice that 31 is 32 - 1, and 63 is 64 - 1. The formula shifts from doubling to (2^n - 1).',
      forgeDialogue: {
        intro: `FORGE: Deception sub-routine online. Resist instinctive cognitive bias.`,
        success: `FORGE: Extraordinary! You bypassed the cognitive trap.`,
        failure: `FORGE: Fallacy triggered. You succumbed to superficial intuition.`,
      }
    };
  }
}
