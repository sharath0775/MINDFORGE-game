import { Puzzle, PuzzleOption } from '../../types/game';

export function generateOddOneOutPuzzle(difficulty: number): Puzzle {
  const type = Math.floor(Math.random() * 3);

  if (type === 0) {
    // Number Pattern Breaker (e.g. 2, 4, 8, 16, 31)
    const items = ['2', '4', '8', '16', '31'];
    const oddItem = '31';
    const ruleDesc = 'All items are powers of 2 (2^n) except 31';

    const options: PuzzleOption[] = items.map(val => ({
      id: `opt_${val}`,
      label: val,
      value: val,
      isCorrect: val === oddItem
    })).sort(() => Math.random() - 0.5);

    return {
      id: `odd_num_${Date.now()}_${Math.random()}`,
      category: 'ODD_ONE_OUT',
      title: 'NUMERICAL PATTERN BREAKER',
      description: 'Analyze the set of numbers and select the single item that BREAKS the underlying mathematical rule.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: `NUMBER SET:\n\n${items.join('    ')}`,
      correctAnswer: oddItem,
      options,
      timeLimitSeconds: Math.max(8, 15 - difficulty),
      difficulty,
      hint: ruleDesc,
      forgeDialogue: {
        intro: `FORGE: Anomaly isolation scan online. Deduce which numerical node violates the set rule.`,
        success: `FORGE: Pattern breaker isolated cleanly. Rule deduction verified.`,
        failure: `FORGE: Incorrect anomaly selection. Set rule misidentified.`,
      }
    };
  } else if (type === 1) {
    // Prime Number Anomaly
    const primes = ['7', '11', '13', '17', '21'];
    const oddItem = '21'; // Composite 3x7 vs Primes
    const ruleDesc = '21 is composite (3x7); all others are prime numbers';

    const options: PuzzleOption[] = primes.map(val => ({
      id: `opt_${val}`,
      label: val,
      value: val,
      isCorrect: val === oddItem
    })).sort(() => Math.random() - 0.5);

    return {
      id: `odd_prime_${Date.now()}_${Math.random()}`,
      category: 'ODD_ONE_OUT',
      title: 'PRIME NUMBER ANOMALY',
      description: 'Identify the number that violates the prime multiplicity rule governing the array.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: `ARRAY SET:\n\n${primes.join('    ')}`,
      correctAnswer: oddItem,
      options,
      timeLimitSeconds: Math.max(8, 15 - difficulty),
      difficulty,
      hint: ruleDesc,
      forgeDialogue: {
        intro: `FORGE: Prime parity audit active. Isolate composite element.`,
        success: `FORGE: Composite element isolated accurately.`,
        failure: `FORGE: Anomaly missed. Composite element undetected.`,
      }
    };
  } else {
    // Symbol Parity Anomaly
    const items = ['▲', '■', '◆', '⬢', '★'];
    const oddItem = '⬢'; // 6-sided hexagon vs 3/4/4/5-sided or filled geometry
    const ruleDesc = 'Hexagon has 6 vertices; all other shapes have 3-5 vertices or 4-fold symmetry';

    const options: PuzzleOption[] = items.map(val => ({
      id: `opt_${val}`,
      label: val,
      value: val,
      isCorrect: val === oddItem
    })).sort(() => Math.random() - 0.5);

    return {
      id: `odd_sym_${Date.now()}_${Math.random()}`,
      category: 'ODD_ONE_OUT',
      title: 'GEOMETRIC PARITY ANOMALY',
      description: 'Determine which geometric glyph violates the vertex/symmetry rule of the set.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: `GLYPH SET:\n\n${items.join('    ')}`,
      correctAnswer: oddItem,
      options,
      timeLimitSeconds: Math.max(8, 15 - difficulty),
      difficulty,
      hint: ruleDesc,
      forgeDialogue: {
        intro: `FORGE: Geometric symmetry scan initialized. Detect anomalous glyph.`,
        success: `FORGE: Geometric anomaly isolated successfully.`,
        failure: `FORGE: Anomaly selection error.`,
      }
    };
  }
}
