import { Puzzle, PuzzleOption } from '../../types/game';

const SHAPES = [
  { name: 'TRIANGLE & DOT', orig: '▲ •', r90: '▶ •', r180: '▼ •', r270: '◀ •', mirror: '• ▲' },
  { name: 'ARROW & SQUARE', orig: '➔ ■', r90: '⬇ ■', r180: '⬅ ■', r270: '⬆ ■', mirror: '■ ➔' },
  { name: 'DIAMOND STAR', orig: '◆ ★', r90: '◈ ★', r180: '◆ ☆', r270: '◈ ☆', mirror: '★ ◆' },
  { name: 'CHEVRON & NODE', orig: '❯ ◉', r90: '⌃ ◉', r180: '❮ ◉', r270: '⌄ ◉', mirror: '◉ ❯' },
];

export function generateShapeRotationPuzzle(difficulty: number): Puzzle {
  const chosen = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const angles = ['90° CLOCKWISE', '180° FLIP', '270° CLOCKWISE', 'HORIZONTAL MIRROR'];
  const targetAngle = angles[Math.floor(Math.random() * angles.length)];

  let correctAnswer = '';
  if (targetAngle === '90° CLOCKWISE') correctAnswer = chosen.r90;
  else if (targetAngle === '180° FLIP') correctAnswer = chosen.r180;
  else if (targetAngle === '270° CLOCKWISE') correctAnswer = chosen.r270;
  else correctAnswer = chosen.mirror;

  const options: PuzzleOption[] = [
    { id: 'c', label: correctAnswer, value: correctAnswer, isCorrect: true },
    { id: 'd1', label: chosen.r90 === correctAnswer ? chosen.r180 : chosen.r90, value: 'd1' },
    { id: 'd2', label: chosen.r270 === correctAnswer ? chosen.mirror : chosen.r270, value: 'd2' },
    { id: 'd3', label: chosen.orig, value: 'd3' },
  ].sort(() => Math.random() - 0.5);

  return {
    id: `shape_rot_${Date.now()}_${Math.random()}`,
    category: 'SHAPE_ROTATION',
    title: 'SPATIAL 2D ROTATION TRANSFORM',
    description: `Identify which target representation matches the ORIGINAL SHAPE after applying a ${targetAngle} spatial transformation.`,
    inputType: 'MULTIPLE_CHOICE',
    questionText: `ORIGINAL SHAPE:   [ ${chosen.orig} ]`,
    correctAnswer: correctAnswer,
    options,
    timeLimitSeconds: Math.max(8, 16 - difficulty),
    difficulty,
    hint: `Mentally rotate the composite elements by ${targetAngle} around the central origin point.`,
    forgeDialogue: {
      intro: `FORGE: 2D spatial rotation field active. Compute target orientation vector.`,
      success: `FORGE: Spatial transformation matched with 100% fidelity.`,
      failure: `FORGE: Spatial rotation calculation error. Orientation mismatch.`,
    }
  };
}
