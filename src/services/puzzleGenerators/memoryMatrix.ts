import { Puzzle } from '../../types/game';

export function generateMemoryMatrixPuzzle(difficulty: number): Puzzle {
  // Matrix size: 4x4, 5x5, 6x6, 8x8
  let gridSize = 4;
  if (difficulty > 7) gridSize = 8;
  else if (difficulty > 5) gridSize = 6;
  else if (difficulty > 3) gridSize = 5;

  const totalCells = gridSize * gridSize;
  const activeCount = Math.min(Math.floor(totalCells * 0.4), 3 + Math.floor(difficulty * 0.8));

  const activeIndices: number[] = [];
  while (activeIndices.length < activeCount) {
    const idx = Math.floor(Math.random() * totalCells);
    if (!activeIndices.includes(idx)) activeIndices.push(idx);
  }

  activeIndices.sort((a, b) => a - b);

  return {
    id: `mem_matrix_${Date.now()}_${Math.random()}`,
    category: 'MEMORY_MATRIX',
    title: `SPATIAL MEMORY MATRIX (${gridSize}x${gridSize})`,
    description: `Memorize the ${activeCount} illuminated node cells in the ${gridSize}x${gridSize} grid before they deactivate.`,
    inputType: 'GRID_SELECT',
    questionText: `Select all ${activeCount} active nodes that illuminated.`,
    correctAnswer: activeIndices.join(','),
    timeLimitSeconds: Math.max(10, 20 - difficulty),
    difficulty,
    hint: 'Group adjacent illuminated nodes into clusters or visual shapes.',
    forgeDialogue: {
      intro: `FORGE: Spatial matrix memory sweep active. Retain cell coordinates.`,
      success: `FORGE: Spatial memory matrix verified with 100% precision.`,
      failure: `FORGE: Spatial coordinate mismatch. Matrix buffer degraded.`,
    },
    metadata: {
      gridSize,
      activeIndices,
      flashDurationMs: Math.max(1500, 4000 - difficulty * 250),
    }
  };
}
