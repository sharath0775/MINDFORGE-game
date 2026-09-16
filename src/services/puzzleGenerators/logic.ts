import { Puzzle, PuzzleOption } from '../../types/game';

export function generateLogicPuzzle(difficulty: number): Puzzle {
  const type = Math.floor(Math.random() * 3);

  if (type === 0) {
    // Missing Operator / Math Equation Deduction
    const a = 3 + Math.floor(Math.random() * 6);
    const b = 2 + Math.floor(Math.random() * 5);
    const c = 2 + Math.floor(Math.random() * 4);

    // Equation: (a [op1] b) [op2] c = target
    const op1List = ['+', '-', '*'];
    const op2List = ['+', '-', '*'];

    const op1 = op1List[Math.floor(Math.random() * op1List.length)];
    const op2 = op2List[Math.floor(Math.random() * op2List.length)];

    let sub = 0;
    if (op1 === '+') sub = a + b;
    else if (op1 === '-') sub = a - b;
    else sub = a * b;

    let target = 0;
    if (op2 === '+') target = sub + c;
    else if (op2 === '-') target = sub - c;
    else target = sub * c;

    const question = `Find the missing operators:  (${a}  ?  ${b})  ?  ${c}  =  ${target}`;
    const correctAnswer = `${op1} and ${op2}`;

    const distractor1 = `${op1 === '+' ? '*' : '+'} and ${op2}`;
    const distractor2 = `${op1} and ${op2 === '*' ? '+' : '*'}`;
    const distractor3 = `${op1 === '-' ? '+' : '-'} and ${op2 === '-' ? '+' : '-'}`;

    const options: PuzzleOption[] = Array.from(new Set([correctAnswer, distractor1, distractor2, distractor3]))
      .map((label, idx) => ({ id: `op_${idx}`, label, value: label }))
      .sort(() => Math.random() - 0.5);

    return {
      id: `logic_op_${Date.now()}_${Math.random()}`,
      category: 'LOGIC',
      title: 'OPERATIONAL DECODING PROTOCOL',
      description: 'Deduce which arithmetic operations balance the target equation.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: question,
      correctAnswer: correctAnswer,
      options,
      timeLimitSeconds: Math.max(10, 18 - difficulty),
      difficulty,
      hint: 'Test multiplication first to gauge order of magnitude relative to the target value.',
      forgeDialogue: {
        intro: `FORGE: Equation corrupted. Reconstruct missing mathematical operators.`,
        success: `FORGE: Operators aligned. Equation verified balance.`,
        failure: `FORGE: Invalid mathematical operator state.`,
      }
    };
  } else if (type === 1) {
    // Truth / Lie Deduction
    const puzzles = [
      {
        q: 'Unit Alpha claims: "Unit Beta is lying." Unit Beta claims: "Unit Alpha and I are both telling the truth." Who is telling the truth?',
        ans: 'Unit Alpha is truthful; Unit Beta is lying.',
        d1: 'Unit Beta is truthful; Unit Alpha is lying.',
        d2: 'Both units are lying.',
        d3: 'Both units are telling the truth.',
        hint: 'If Beta is telling the truth, then Alpha must be telling the truth, which contradicts Alpha saying Beta is lying!'
      },
      {
        q: 'Unit X says: "At least one of us is a Liar." If Unit X is either a pure Truth-Teller or a pure Liar, what is Unit Y?',
        ans: 'Unit Y is a Truth-Teller (and Unit X is also a Truth-Teller).',
        d1: 'Unit Y is a Liar.',
        d2: 'Unit X is a Liar.',
        d3: 'Impossible to determine with given parameters.',
        hint: 'If X were a liar, "at least one is a liar" would be true, creating a logical paradox! Thus X is truthful.'
      },
      {
        q: 'Box A says: "The Key is in Box B." Box B says: "The Key is NOT in Box A." Box C says: "The Key is in Box C." If ONLY ONE statement is true, where is the Key?',
        ans: 'Box A',
        d1: 'Box B',
        d2: 'Box C',
        d3: 'None of the boxes',
        hint: 'Test each box as the location of the Key and count how many statements become true.'
      }
    ];

    const chosen = puzzles[Math.floor(Math.random() * puzzles.length)];
    const options: PuzzleOption[] = [
      { id: 'c', label: chosen.ans, value: chosen.ans, isCorrect: true },
      { id: 'd1', label: chosen.d1, value: chosen.d1 },
      { id: 'd2', label: chosen.d2, value: chosen.d2 },
      { id: 'd3', label: chosen.d3, value: chosen.d3 },
    ].sort(() => Math.random() - 0.5);

    return {
      id: `logic_truth_${Date.now()}_${Math.random()}`,
      category: 'LOGIC',
      title: 'BOOLEAN TRUTH-LIE DEPLOYMENT',
      description: 'Analyze contradictory agent claims and isolate absolute truth.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: chosen.q,
      correctAnswer: chosen.ans,
      options,
      timeLimitSeconds: Math.max(12, 22 - difficulty * 1.5),
      difficulty,
      hint: chosen.hint,
      forgeDialogue: {
        intro: `FORGE: Boolean paradox detected. Isolate logical consistency.`,
        success: `FORGE: Logical paradox resolved cleanly. Exceptional deduction.`,
        failure: `FORGE: Paradox unresolved. Mind trapped in contradiction loop.`,
      }
    };
  } else {
    // Spatial Balance / Weight Deduction
    const w1 = 2 + Math.floor(Math.random() * 3); // A = w1 * B
    const w2 = 3 + Math.floor(Math.random() * 2); // B = w2 * C

    const totalC = w1 * w2;

    const question = `Scale 1: 1 Blue Sphere (●) = ${w1} Purple Cubes (■)\nScale 2: 1 Purple Cube (■) = ${w2} Gold Triangles (▲)\n\nHow many Gold Triangles (▲) equal 1 Blue Sphere (●)?`;
    const correctAnswer = totalC;

    const options: PuzzleOption[] = [
      { id: 'c', label: `${correctAnswer} Triangles`, value: correctAnswer, isCorrect: true },
      { id: 'd1', label: `${w1 + w2} Triangles`, value: w1 + w2 },
      { id: 'd2', label: `${w1 * w2 + 2} Triangles`, value: w1 * w2 + 2 },
      { id: 'd3', label: `${w1 * (w2 - 1)} Triangles`, value: w1 * (w2 - 1) },
    ].sort(() => Math.random() - 0.5);

    return {
      id: `logic_weight_${Date.now()}_${Math.random()}`,
      category: 'LOGIC',
      title: 'EQUILIBRIUM WEIGHT MATRIX',
      description: 'Compute substitute equivalence ratios across multiple balance scales.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: question,
      correctAnswer: correctAnswer,
      options,
      timeLimitSeconds: Math.max(10, 18 - difficulty),
      difficulty,
      hint: 'Substitute the second scale ratio into the first scale equation (● = w1 * (w2 * ▲)).',
      forgeDialogue: {
        intro: `FORGE: Mass balance grid offline. Calculate substitution ratio.`,
        success: `FORGE: Equilibrium restored. Mathematical ratio precise.`,
        failure: `FORGE: Weight imbalance. Mathematical substitution error.`,
      }
    };
  }
}
