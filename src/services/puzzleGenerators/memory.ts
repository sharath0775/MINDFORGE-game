import { Puzzle } from '../../types/game';

const SYMBOLS = ['▲', '■', '●', '★', '◆', '✦', '♠', '♣'];
const COLORS = ['Cyan', 'Purple', 'Emerald', 'Crimson', 'Gold'];

export function generateMemoryPuzzle(difficulty: number): Puzzle {
  const type = Math.floor(Math.random() * 3);

  if (type === 0) {
    // Number / Symbol Sequence Recall
    const length = Math.min(9, 3 + Math.floor(difficulty * 0.7));
    const isSymbol = difficulty > 3 && Math.random() > 0.5;

    const sourcePool = isSymbol ? SYMBOLS : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const sequence: string[] = [];
    for (let i = 0; i < length; i++) {
      sequence.push(sourcePool[Math.floor(Math.random() * sourcePool.length)]);
    }

    const seqStr = sequence.join(isSymbol ? '  ' : '');
    const isReverse = difficulty > 6 && Math.random() > 0.6;

    const correctAnswer = isReverse ? [...sequence].reverse().join(isSymbol ? '' : '') : sequence.join(isSymbol ? '' : '');

    // Options for multiple choice
    const distractor1 = isReverse ? [...sequence].join(isSymbol ? '' : '') : [...sequence].reverse().join(isSymbol ? '' : '');
    const distractor2 = [...sequence].sort(() => Math.random() - 0.5).join(isSymbol ? '' : '');
    const distractor3 = sequence.map(s => sourcePool[Math.floor(Math.random() * sourcePool.length)]).join(isSymbol ? '' : '');

    const optionPool = Array.from(new Set([correctAnswer, distractor1, distractor2, distractor3]))
      .slice(0, 4)
      .sort(() => Math.random() - 0.5);

    return {
      id: `mem_seq_${Date.now()}_${Math.random()}`,
      category: 'MEMORY',
      title: isReverse ? 'REVERSE MEMORY SEQUENCE' : 'NEURAL SEQUENCE RECALL',
      description: `Observe the sequence carefully. It will disappear in a few seconds. ${isReverse ? 'REPRODUCE IN REVERSE ORDER!' : 'REPRODUCE IN EXACT ORDER!'}`,
      inputType: 'MEMORY_FLASH',
      questionText: seqStr,
      correctAnswer: correctAnswer,
      options: optionPool.map((opt, i) => ({ id: `opt_${i}`, label: opt, value: opt })),
      timeLimitSeconds: Math.max(8, 20 - difficulty * 1.2),
      difficulty,
      hint: isReverse ? 'Remember to invert the order of items from last to first.' : 'Chunk items in pairs of two for higher retention.',
      forgeDialogue: {
        intro: `FORGE: Initializing neural memory scan. Observe sequence delta...`,
        success: `FORGE: Neural pattern recorded correctly. Synaptic fidelity high.`,
        failure: `FORGE: Synaptic decay detected. Memory retention below protocol threshold.`,
      },
      metadata: {
        flashDurationMs: Math.max(1500, 4500 - difficulty * 250),
        isReverse,
      },
    };
  } else if (type === 1) {
    // Grid Tile Flash Memory
    const gridSize = difficulty > 5 ? 4 : 3;
    const cellCount = gridSize * gridSize;
    const activeCount = Math.min(gridSize * 2 + 1, 3 + Math.floor(difficulty * 0.5));

    const activeIndices: number[] = [];
    while (activeIndices.length < activeCount) {
      const idx = Math.floor(Math.random() * cellCount);
      if (!activeIndices.includes(idx)) activeIndices.push(idx);
    }

    return {
      id: `mem_grid_${Date.now()}_${Math.random()}`,
      category: 'MEMORY',
      title: 'QUANTUM MATRIX FLASH',
      description: `Memorize the illuminated node positions in the ${gridSize}x${gridSize} grid before they deactivate.`,
      inputType: 'GRID_SELECT',
      questionText: `Select all ${activeCount} active nodes that illuminated.`,
      correctAnswer: activeIndices.sort((a, b) => a - b).join(','),
      timeLimitSeconds: Math.max(10, 18 - difficulty),
      difficulty,
      hint: `Visualize the active tiles as a single geometric shape or layout.`,
      forgeDialogue: {
        intro: `FORGE: Illuminating spatial matrix nodes... Prepare neural buffer.`,
        success: `FORGE: Spatial coordinates verified. Perfect pattern reconstruction.`,
        failure: `FORGE: Node mismatch. Spatial memory index corrupted.`,
      },
      metadata: {
        gridSize,
        activeIndices,
        flashDurationMs: Math.max(1800, 3500 - difficulty * 200),
      },
    };
  } else {
    // Audio / Visual Sequence Pattern
    const colorLen = Math.min(7, 3 + Math.floor(difficulty * 0.6));
    const activeColors = COLORS.slice(0, Math.min(COLORS.length, 3 + Math.floor(difficulty * 0.3)));
    
    const seq: string[] = [];
    for (let i = 0; i < colorLen; i++) {
      seq.push(activeColors[Math.floor(Math.random() * activeColors.length)]);
    }

    const correctAnswer = seq.join('-');
    const distractor1 = [...seq].reverse().join('-');
    const distractor2 = seq.map(c => activeColors[Math.floor(Math.random() * activeColors.length)]).join('-');
    const distractor3 = seq.slice(1).concat(seq[0]).join('-');

    const optionPool = Array.from(new Set([correctAnswer, distractor1, distractor2, distractor3]))
      .slice(0, 4)
      .sort(() => Math.random() - 0.5);

    return {
      id: `mem_color_${Date.now()}_${Math.random()}`,
      category: 'MEMORY',
      title: 'CHROMA CHIME HARMONY',
      description: 'Observe and listen to the color pulse sequence, then select the exact sound/color chain.',
      inputType: 'MEMORY_FLASH',
      questionText: seq.join(' → '),
      correctAnswer: correctAnswer,
      options: optionPool.map((opt, i) => ({ id: `opt_${i}`, label: opt, value: opt })),
      timeLimitSeconds: Math.max(8, 16 - difficulty),
      difficulty,
      hint: 'Associate pitch tones with each color to reinforce dual-channel memory.',
      forgeDialogue: {
        intro: `FORGE: Broadcasting harmonic color pulses. Maintain focal concentration.`,
        success: `FORGE: Audio-visual resonance matched flawlessly.`,
        failure: `FORGE: Frequency dissonance. Harmonic chain broken.`,
      },
      metadata: {
        flashDurationMs: Math.max(2000, 4000 - difficulty * 200),
        sequence: seq,
      },
    };
  }
}
