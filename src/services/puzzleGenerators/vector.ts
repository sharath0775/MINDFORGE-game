import { Puzzle, PuzzleOption } from '../../types/game';

const ARROWS = [
  { symbol: '↑', name: 'NORTH', angle: 0 },
  { symbol: '↗', name: 'NORTH-EAST', angle: 45 },
  { symbol: '→', name: 'EAST', angle: 90 },
  { symbol: '↘', name: 'SOUTH-EAST', angle: 135 },
  { symbol: '↓', name: 'SOUTH', angle: 180 },
  { symbol: '↙', name: 'SOUTH-WEST', angle: 225 },
  { symbol: '←', name: 'WEST', angle: 270 },
  { symbol: '↖', name: 'NORTH-WEST', angle: 315 },
];

export function generateVectorPuzzle(difficulty: number): Puzzle {
  const type = Math.floor(Math.random() * 4);

  if (type === 0) {
    // 1. Follow Sequence Direction Trajectory
    const arrowCount = Math.min(15, 3 + Math.floor(difficulty * 1.2)); // 3 to 15+ arrows
    const seq: (typeof ARROWS[0])[] = [];

    for (let i = 0; i < arrowCount; i++) {
      seq.push(ARROWS[Math.floor(Math.random() * ARROWS.length)]);
    }

    const lastArrow = seq[seq.length - 1];
    const correctAnswer = `${lastArrow.symbol} ${lastArrow.name}`;

    const distractor1 = `${ARROWS[(ARROWS.indexOf(lastArrow) + 4) % 8].symbol} ${ARROWS[(ARROWS.indexOf(lastArrow) + 4) % 8].name}`;
    const distractor2 = `${ARROWS[(ARROWS.indexOf(lastArrow) + 2) % 8].symbol} ${ARROWS[(ARROWS.indexOf(lastArrow) + 2) % 8].name}`;
    const distractor3 = `${ARROWS[(ARROWS.indexOf(lastArrow) + 6) % 8].symbol} ${ARROWS[(ARROWS.indexOf(lastArrow) + 6) % 8].name}`;

    const options: PuzzleOption[] = Array.from(new Set([correctAnswer, distractor1, distractor2, distractor3]))
      .map((label, i) => ({ id: `vec_${i}`, label, value: label }))
      .sort(() => Math.random() - 0.5);

    const questionSeq = seq.map(a => a.symbol).join('   ');

    return {
      id: `vec_seq_${Date.now()}_${Math.random()}`,
      category: 'VECTOR',
      title: 'VECTOR TRAJECTORY TRACKING',
      description: `Follow the sequence of ${arrowCount} directional vectors in order. Where are you facing at the final terminal node?`,
      inputType: 'MULTIPLE_CHOICE',
      questionText: `VECTOR CHAIN:\n\n${questionSeq}`,
      correctAnswer: correctAnswer,
      options,
      timeLimitSeconds: Math.max(8, 20 - difficulty * 0.8),
      difficulty,
      hint: 'Focus strictly on the final orientation vector in the linear sequence chain.',
      forgeDialogue: {
        intro: `FORGE: Vector navigation stream engaged. Track spatial trajectory to terminal orientation.`,
        success: `FORGE: Directional vector verified. Exceptional spatial orientation acuity.`,
        failure: `FORGE: Navigation error. Terminal vector orientation miscalculated.`,
      },
      metadata: {
        arrowCount,
        sequence: seq.map(a => a.symbol),
      }
    };
  } else if (type === 1) {
    // 2. Opposite Direction Calculation
    const mainArrow = ARROWS[Math.floor(Math.random() * ARROWS.length)];
    const oppositeIdx = (ARROWS.indexOf(mainArrow) + 4) % 8;
    const oppositeArrow = ARROWS[oppositeIdx];

    const correctAnswer = `${oppositeArrow.symbol} ${oppositeArrow.name}`;

    const options: PuzzleOption[] = ARROWS.slice(0, 4).map((a, i) => {
      const target = (i % 2 === 0) ? oppositeArrow : ARROWS[(oppositeIdx + i + 1) % 8];
      return { id: `opt_${i}`, label: `${target.symbol} ${target.name}`, value: `${target.symbol} ${target.name}` };
    }).sort(() => Math.random() - 0.5);

    return {
      id: `vec_opp_${Date.now()}_${Math.random()}`,
      category: 'VECTOR',
      title: 'VECTOR INVERSION PROTOCOL',
      description: 'Deduce the EXACT 180° inverted opposite direction of the primary vector.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: `PRIMARY VECTOR:  [ ${mainArrow.symbol} ${mainArrow.name} ]`,
      correctAnswer: correctAnswer,
      options,
      timeLimitSeconds: Math.max(6, 14 - difficulty),
      difficulty,
      hint: 'Rotate the primary directional vector exactly 180° across the compass axis.',
      forgeDialogue: {
        intro: `FORGE: Vector inversion sub-routine active. Calculate 180° spatial reverse.`,
        success: `FORGE: Inverted vector matches. Spatial reflection precise.`,
        failure: `FORGE: Vector inversion calculation error.`,
      }
    };
  } else if (type === 2) {
    // 3. Odd Arrow Out / Rotational Anomaly
    const isClockwise = Math.random() > 0.5;
    const startIdx = Math.floor(Math.random() * 8);

    const validChain: (typeof ARROWS[0])[] = [];
    for (let i = 0; i < 4; i++) {
      const idx = isClockwise ? (startIdx + i) % 8 : (startIdx - i + 8) % 8;
      validChain.push(ARROWS[idx]);
    }

    const intruderIdx = (startIdx + (isClockwise ? 5 : 3)) % 8;
    const intruderArrow = ARROWS[intruderIdx];

    const pool = [...validChain];
    const intruderInsertPos = Math.floor(Math.random() * 4);
    pool.splice(intruderInsertPos, 0, intruderArrow);

    const questionText = pool.map(a => a.symbol).join('    ');
    const correctAnswer = intruderArrow.symbol;

    const options: PuzzleOption[] = pool.map((a, i) => ({
      id: `arr_${i}`,
      label: `${a.symbol} (${a.name})`,
      value: a.symbol,
      isCorrect: a.symbol === intruderArrow.symbol
    })).sort(() => Math.random() - 0.5);

    return {
      id: `vec_odd_${Date.now()}_${Math.random()}`,
      category: 'VECTOR',
      title: 'VECTOR ROTATIONAL ANOMALY',
      description: 'Four arrows follow a smooth step-wise rotation cycle. Identify the ONE distractor arrow breaking the rotational flow!',
      inputType: 'MULTIPLE_CHOICE',
      questionText: `VECTOR STREAM:\n\n${questionText}`,
      correctAnswer: correctAnswer,
      options,
      timeLimitSeconds: Math.max(8, 16 - difficulty),
      difficulty,
      hint: 'Track the angular step progression (+45° or -45°) between consecutive arrows.',
      forgeDialogue: {
        intro: `FORGE: Vector stream corruption detected. Isolate anomalous directional element.`,
        success: `FORGE: Rotational anomaly isolated flawlessly.`,
        failure: `FORGE: Anomaly missed. Rotational chain corrupted.`,
      }
    };
  } else {
    // 4. Missing Cardinal Direction
    const shuffled = [...ARROWS].sort(() => Math.random() - 0.5);
    const missing = shuffled[0];
    const present = shuffled.slice(1, 6);

    const questionText = present.map(a => a.symbol).join('    ');
    const correctAnswer = `${missing.symbol} ${missing.name}`;

    const options: PuzzleOption[] = [
      { id: 'c', label: correctAnswer, value: correctAnswer, isCorrect: true },
      { id: 'd1', label: `${shuffled[1].symbol} ${shuffled[1].name}`, value: `${shuffled[1].symbol} ${shuffled[1].name}` },
      { id: 'd2', label: `${shuffled[2].symbol} ${shuffled[2].name}`, value: `${shuffled[2].symbol} ${shuffled[2].name}` },
      { id: 'd3', label: `${shuffled[3].symbol} ${shuffled[3].name}`, value: `${shuffled[3].symbol} ${shuffled[3].name}` },
    ].sort(() => Math.random() - 0.5);

    return {
      id: `vec_missing_${Date.now()}_${Math.random()}`,
      category: 'VECTOR',
      title: 'MISSING COMPASS VECTOR',
      description: 'Scan the vector set and identify which direction is MISSING from the sequence grid.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: `PRESENT VECTORS:\n\n${questionText}`,
      correctAnswer: correctAnswer,
      options,
      timeLimitSeconds: Math.max(8, 15 - difficulty),
      difficulty,
      hint: 'Cross-reference cardinal (N, S, E, W) and ordinal (NE, NW, SE, SW) directions.',
      forgeDialogue: {
        intro: `FORGE: Compass matrix audit initialized. Deduce missing directional coordinate.`,
        success: `FORGE: Missing compass coordinate restored.`,
        failure: `FORGE: Missing direction misidentified.`,
      }
    };
  }
}
