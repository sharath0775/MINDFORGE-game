import { Puzzle, PuzzleOption } from '../../types/game';

export function generateWeightBalancePuzzle(difficulty: number): Puzzle {
  const w1 = 3; // 1 Sphere (●) = 3 Cubes (■)
  const w2 = 2; // 1 Cube (■) = 2 Triangles (▲)
  const total = w1 * w2; // 6 Triangles

  const question = `Scale 1: ⚖️  1 Blue Sphere (●) = 3 Purple Cubes (■)\nScale 2: ⚖️  1 Purple Cube (■) = 2 Gold Triangles (▲)\n\nWhich object set is HEAVIEST?`;
  const correctAnswer = `1 Blue Sphere (●) [Equivalent to 6 Triangles]`;

  const options: PuzzleOption[] = [
    { id: 'c', label: `1 Blue Sphere (●) [Equivalent to 6 Triangles]`, value: correctAnswer, isCorrect: true },
    { id: 'd1', label: `4 Gold Triangles (▲)`, value: `4 Triangles` },
    { id: 'd2', label: `2 Purple Cubes (■)`, value: `2 Cubes` },
    { id: 'd3', label: `All sets are equal in weight`, value: `Equal` },
  ].sort(() => Math.random() - 0.5);

  return {
    id: `weight_bal_${Date.now()}_${Math.random()}`,
    category: 'WEIGHT_BALANCE',
    title: 'SCALE EQUILIBRIUM & WEIGHT COMPARISON',
    description: 'Substitute scale weights to determine relative mass equivalence.',
    inputType: 'MULTIPLE_CHOICE',
    questionText: question,
    correctAnswer: correctAnswer,
    options,
    timeLimitSeconds: Math.max(8, 16 - difficulty),
    difficulty,
    hint: 'Substitute: 1 Sphere = 3 Cubes = 3 × (2 Triangles) = 6 Triangles.',
    forgeDialogue: {
      intro: `FORGE: Scale equilibrium telemetry online. Compute relative mass ratios.`,
      success: `FORGE: Mass equilibrium substitution verified.`,
      failure: `FORGE: Weight substitution error. Mass miscalculated.`,
    }
  };
}
