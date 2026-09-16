import { Puzzle, PuzzleOption } from '../../types/game';

const ICONS = ['❖', '✦', '▲', '⬢', '◈', '★', '◉', '■', '◆'];

export function generateObservationPuzzle(difficulty: number): Puzzle {
  const gridSize = difficulty > 5 ? 4 : 3; // 3x3 or 4x4
  const totalCells = gridSize * gridSize;

  const originalGrid: string[] = [];
  for (let i = 0; i < totalCells; i++) {
    originalGrid.push(ICONS[Math.floor(Math.random() * ICONS.length)]);
  }

  // Pick one cell to change
  const alteredIndex = Math.floor(Math.random() * totalCells);
  const currentIcon = originalGrid[alteredIndex];
  
  let newIcon = currentIcon;
  while (newIcon === currentIcon) {
    newIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
  }

  const modifiedGrid = [...originalGrid];
  modifiedGrid[alteredIndex] = newIcon;

  const row = Math.floor(alteredIndex / gridSize) + 1;
  const col = (alteredIndex % gridSize) + 1;
  const targetLabel = `Row ${row}, Column ${col}`;

  const optionList: PuzzleOption[] = [];
  // Add correct option
  optionList.push({ id: `cell_${alteredIndex}`, label: targetLabel, value: alteredIndex, isCorrect: true });

  // Add 3 distractor cells
  while (optionList.length < Math.min(4, totalCells)) {
    const rIdx = Math.floor(Math.random() * totalCells);
    if (rIdx !== alteredIndex && !optionList.some(o => o.value === rIdx)) {
      const rRow = Math.floor(rIdx / gridSize) + 1;
      const rCol = (rIdx % gridSize) + 1;
      optionList.push({ id: `cell_${rIdx}`, label: `Row ${rRow}, Column ${rCol}`, value: rIdx });
    }
  }

  optionList.sort(() => Math.random() - 0.5);

  return {
    id: `obs_grid_${Date.now()}_${Math.random()}`,
    category: 'OBSERVATION',
    title: 'SPATIAL ANOMALY AUDIT',
    description: `Inspect the initial matrix layout. After the shift, spot which coordinate underwent a subtle visual icon change.`,
    inputType: 'MULTIPLE_CHOICE',
    questionText: `Which cell coordinate changed between state A and state B?`,
    correctAnswer: alteredIndex,
    options: optionList,
    timeLimitSeconds: Math.max(8, 16 - difficulty),
    difficulty,
    hint: 'Focus your gaze on quadrant centers rather than individual symbols.',
    forgeDialogue: {
      intro: `FORGE: Capturing optical state baseline. Shift sequence initiating...`,
      success: `FORGE: Spatial anomaly isolated instantly. Perception acuity exceptional.`,
      failure: `FORGE: Anomaly missed. Visual change undetected.`,
    },
    metadata: {
      gridSize,
      originalGrid,
      modifiedGrid,
      alteredIndex,
      flashDurationMs: Math.max(1500, 3500 - difficulty * 200),
    }
  };
}
