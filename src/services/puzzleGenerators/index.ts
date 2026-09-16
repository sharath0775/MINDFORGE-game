import { CategoryType, LevelConfig, Puzzle } from '../../types/game';
import { generateMemoryPuzzle } from './memory';
import { generatePatternPuzzle } from './pattern';
import { generateLogicPuzzle } from './logic';
import { generateObservationPuzzle } from './observation';
import { generateSpeedPuzzle } from './speed';
import { generateDecisionPuzzle } from './decision';
import { generatePsychologyPuzzle } from './psychology';
import { generateCombinationPuzzle } from './combination';
import { generateVectorPuzzle } from './vector';
import { generateRealWorldPuzzle } from './realWorld';
import { generateMemoryMatrixPuzzle } from './memoryMatrix';
import { generateNumberSequencePuzzle } from './numberSequence';
import { generateShapeRotationPuzzle } from './shapeRotation';
import { generateOddOneOutPuzzle } from './oddOneOut';
import { generateQuickMathPuzzle } from './quickMath';
import { generateColorConflictPuzzle } from './colorConflict';
import { generateSequenceMemoryPuzzle } from './sequenceMemory';
import { generateLogicGridPuzzle } from './logicGrid';
import { generateWeightBalancePuzzle } from './weightBalance';

export function generatePuzzle(category: CategoryType, difficulty: number): Puzzle {
  switch (category) {
    case 'MEMORY': return generateMemoryPuzzle(difficulty);
    case 'PATTERN': return generatePatternPuzzle(difficulty);
    case 'LOGIC': return generateLogicPuzzle(difficulty);
    case 'OBSERVATION': return generateObservationPuzzle(difficulty);
    case 'SPEED': return generateSpeedPuzzle(difficulty);
    case 'DECISION': return generateDecisionPuzzle(difficulty);
    case 'PSYCHOLOGY': return generatePsychologyPuzzle(difficulty);
    case 'COMBINATION': return generateCombinationPuzzle(difficulty);
    case 'VECTOR': return generateVectorPuzzle(difficulty);
    case 'REAL_WORLD': return generateRealWorldPuzzle(difficulty);
    case 'MEMORY_MATRIX': return generateMemoryMatrixPuzzle(difficulty);
    case 'NUMBER_SEQUENCE': return generateNumberSequencePuzzle(difficulty);
    case 'SHAPE_ROTATION': return generateShapeRotationPuzzle(difficulty);
    case 'ODD_ONE_OUT': return generateOddOneOutPuzzle(difficulty);
    case 'QUICK_MATH': return generateQuickMathPuzzle(difficulty);
    case 'COLOR_CONFLICT': return generateColorConflictPuzzle(difficulty);
    case 'SEQUENCE_MEMORY': return generateSequenceMemoryPuzzle(difficulty);
    case 'LOGIC_GRID': return generateLogicGridPuzzle(difficulty);
    case 'WEIGHT_BALANCE': return generateWeightBalancePuzzle(difficulty);
    default: return generateLogicPuzzle(difficulty);
  }
}

export const CAMPAIGN_LEVELS: LevelConfig[] = [
  // STAGE 1 — AWAKENING
  { id: 's1_l1', stageId: 1, levelNumber: 1, title: 'SYNAPSE INITIALIZATION', description: 'Basic sequence recall, vector direction, and speed check.', categories: ['MEMORY', 'SPEED', 'VECTOR'], targetScoreToPass: 250, lives: 3, puzzleCount: 4 },
  { id: 's1_l2', stageId: 1, levelNumber: 2, title: 'PATTERN RESONANCE', description: 'Numerical extrapolation, number sequences, and node memory.', categories: ['PATTERN', 'NUMBER_SEQUENCE', 'MEMORY'], targetScoreToPass: 300, lives: 3, puzzleCount: 4 },
  { id: 's1_l3', stageId: 1, levelNumber: 3, title: 'ELEMENTAL LOGIC', description: 'Quick math equations and fundamental real-world reasoning.', categories: ['LOGIC', 'QUICK_MATH', 'REAL_WORLD'], targetScoreToPass: 350, lives: 3, puzzleCount: 4 },
  { id: 's1_l4', stageId: 1, levelNumber: 4, title: 'CHROMA AUDIT', description: 'Observation grid flash and color conflict Stroop test.', categories: ['OBSERVATION', 'COLOR_CONFLICT', 'MEMORY'], targetScoreToPass: 400, lives: 3, puzzleCount: 5 },
  { id: 's1_l5', stageId: 1, levelNumber: 5, title: 'STAGE 1 FINAL GATEWAY', description: 'Evaluation of Stage 1 fundamentals.', categories: ['MEMORY', 'VECTOR', 'REAL_WORLD', 'QUICK_MATH'], targetScoreToPass: 500, lives: 3, puzzleCount: 5 },

  // STAGE 2 — PERCEPTION
  { id: 's2_l1', stageId: 2, levelNumber: 1, title: 'SPATIAL DISTORTION', description: 'Memory matrix cells and shape rotation transformations.', categories: ['MEMORY_MATRIX', 'SHAPE_ROTATION'], targetScoreToPass: 450, lives: 3, puzzleCount: 5 },
  { id: 's2_l2', stageId: 2, levelNumber: 2, title: 'STROOP INTERFERENCE', description: 'High-speed color conflict and odd-one-out anomaly detection.', categories: ['COLOR_CONFLICT', 'ODD_ONE_OUT', 'SPEED'], targetScoreToPass: 500, lives: 3, puzzleCount: 5 },
  { id: 's2_l3', stageId: 3, levelNumber: 3, title: 'MATRIX SHIFT', description: 'Symbol rotation matrices and vector trajectory chains.', categories: ['SHAPE_ROTATION', 'VECTOR', 'PATTERN'], targetScoreToPass: 550, lives: 3, puzzleCount: 5 },
  { id: 's2_l4', stageId: 2, levelNumber: 4, title: 'HIGH-FREQUENCY TARGETING', description: 'Rapid quick math calculations with distractor noise.', categories: ['QUICK_MATH', 'SPEED', 'SEQUENCE_MEMORY'], targetScoreToPass: 600, lives: 3, puzzleCount: 6 },
  { id: 's2_l5', stageId: 2, levelNumber: 5, title: 'STAGE 2 EVALUATION CORE', description: 'Complex spatial & perceptual challenge suite.', categories: ['MEMORY_MATRIX', 'SHAPE_ROTATION', 'VECTOR', 'COLOR_CONFLICT'], targetScoreToPass: 700, lives: 3, puzzleCount: 6 },

  // STAGE 3 — COGNITION
  { id: 's3_l1', stageId: 3, levelNumber: 1, title: 'BOOLEAN DEDUCTION', description: 'Logic grid elimination and real-world budgeting math.', categories: ['LOGIC_GRID', 'REAL_WORLD'], targetScoreToPass: 600, lives: 3, puzzleCount: 5 },
  { id: 's3_l2', stageId: 3, levelNumber: 2, title: 'QUALITATIVE EQUILIBRIUM', description: 'Scale weight balance substitution puzzles.', categories: ['WEIGHT_BALANCE', 'LOGIC'], targetScoreToPass: 650, lives: 3, puzzleCount: 5 },
  { id: 's3_l3', stageId: 3, levelNumber: 3, title: 'EXTENDED MEMORY MATRIX', description: 'Dense sequence memory and matrix cell recall.', categories: ['SEQUENCE_MEMORY', 'MEMORY_MATRIX'], targetScoreToPass: 700, lives: 3, puzzleCount: 6 },
  { id: 's3_l4', stageId: 3, levelNumber: 4, title: 'STRATEGIC EXPECTATION', description: 'Real-world transit kinematics & route optimization.', categories: ['REAL_WORLD', 'DECISION'], targetScoreToPass: 750, lives: 3, puzzleCount: 6 },
  { id: 's3_l5', stageId: 3, levelNumber: 5, title: 'STAGE 3 COGNITIVE APEX', description: 'Deductive reasoning and multi-step math.', categories: ['LOGIC_GRID', 'WEIGHT_BALANCE', 'REAL_WORLD', 'QUICK_MATH'], targetScoreToPass: 850, lives: 3, puzzleCount: 6 },

  // STAGE 4 — DECEPTION
  { id: 's4_l1', stageId: 4, levelNumber: 1, title: 'INTUITIVE FALLACY', description: 'Cognitive bias traps and odd-one-out rule breakers.', categories: ['PSYCHOLOGY', 'ODD_ONE_OUT'], targetScoreToPass: 700, lives: 2, puzzleCount: 5 },
  { id: 's4_l2', stageId: 4, levelNumber: 2, title: 'NON-LINEAR REGRESSION', description: 'Deceptive number sequences and inverted vectors.', categories: ['NUMBER_SEQUENCE', 'VECTOR'], targetScoreToPass: 750, lives: 2, puzzleCount: 5 },
  { id: 's4_l3', stageId: 4, levelNumber: 3, title: 'PARADOXIC PROBABILITY', description: 'Counter-intuitive probability and decision dilemma traps.', categories: ['PSYCHOLOGY', 'REAL_WORLD', 'DECISION'], targetScoreToPass: 800, lives: 2, puzzleCount: 6 },
  { id: 's4_l4', stageId: 4, levelNumber: 4, title: 'DUAL-NEURAL DISRUPTION', description: 'Memory + Logic cross-transformation under deception noise.', categories: ['COMBINATION', 'SEQUENCE_MEMORY'], targetScoreToPass: 850, lives: 2, puzzleCount: 6 },
  { id: 's4_l5', stageId: 4, levelNumber: 5, title: 'STAGE 4 MAZE OF DECEPTION', description: 'Survive cognitive bias traps and misleading optical cues.', categories: ['PSYCHOLOGY', 'ODD_ONE_OUT', 'SHAPE_ROTATION', 'COLOR_CONFLICT'], targetScoreToPass: 1000, lives: 2, puzzleCount: 6 },

  // STAGE 5 — THE FORGE
  { id: 's5_l1', stageId: 5, levelNumber: 1, title: 'NEURAL CONVERGENCE', description: 'High-speed multi-category barrage.', categories: ['VECTOR', 'QUICK_MATH', 'LOGIC_GRID'], targetScoreToPass: 900, lives: 2, puzzleCount: 6 },
  { id: 's5_l2', stageId: 5, levelNumber: 2, title: 'PARADOX MATRIX', description: 'Truth deduction combined with memory matrix recall.', categories: ['LOGIC_GRID', 'MEMORY_MATRIX', 'PSYCHOLOGY'], targetScoreToPass: 1000, lives: 2, puzzleCount: 6 },
  { id: 's5_l3', stageId: 5, levelNumber: 3, title: 'CRITICAL STRATAGEM', description: 'Real-world decision trade-offs with Stroop reaction testing.', categories: ['REAL_WORLD', 'COLOR_CONFLICT', 'WEIGHT_BALANCE'], targetScoreToPass: 1100, lives: 2, puzzleCount: 7 },
  { id: 's5_l4', stageId: 5, levelNumber: 4, title: 'MAXIMUM ENTROPY', description: 'Dense sequence memory & shape rotations.', categories: ['SEQUENCE_MEMORY', 'SHAPE_ROTATION', 'ODD_ONE_OUT'], targetScoreToPass: 1200, lives: 2, puzzleCount: 7 },
  { id: 's5_l5', stageId: 5, levelNumber: 5, title: 'THE FORGE ABSOLUTE', description: 'The ultimate mind-training test combining all cognitive dimensions.', categories: ['VECTOR', 'REAL_WORLD', 'MEMORY_MATRIX', 'QUICK_MATH', 'COLOR_CONFLICT', 'LOGIC_GRID', 'WEIGHT_BALANCE', 'SHAPE_ROTATION'], targetScoreToPass: 1400, lives: 2, puzzleCount: 8 }
];

export function generateLevelPuzzles(levelConfig: LevelConfig, ddaDifficulty: number): Puzzle[] {
  const puzzles: Puzzle[] = [];
  const baseDiff = levelConfig.stageId * 1.5 + levelConfig.levelNumber * 0.4 + ddaDifficulty;

  for (let i = 0; i < levelConfig.puzzleCount; i++) {
    const category = levelConfig.categories[i % levelConfig.categories.length];
    const itemDiff = Math.min(10, Math.max(1, baseDiff + (i * 0.3)));
    puzzles.push(generatePuzzle(category, itemDiff));
  }

  return puzzles;
}

function seededRandom(seed: number) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateDailyPuzzles(dateStr: string): Puzzle[] {
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed += dateStr.charCodeAt(i) * (i + 1);
  }

  const dailyCategories: CategoryType[] = [
    'VECTOR', 'REAL_WORLD', 'MEMORY_MATRIX', 'NUMBER_SEQUENCE', 
    'SHAPE_ROTATION', 'ODD_ONE_OUT', 'QUICK_MATH', 'COLOR_CONFLICT', 
    'LOGIC_GRID', 'WEIGHT_BALANCE'
  ];
  const puzzles: Puzzle[] = [];

  for (let i = 0; i < 5; i++) {
    const catIdx = Math.floor(seededRandom(seed + i * 17) * dailyCategories.length);
    const cat = dailyCategories[catIdx];
    const diff = 4 + Math.floor(seededRandom(seed + i * 31) * 5);
    puzzles.push(generatePuzzle(cat, diff));
  }

  return puzzles;
}
