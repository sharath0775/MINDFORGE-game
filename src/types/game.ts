export type CategoryType = 
  | 'MEMORY' 
  | 'PATTERN' 
  | 'LOGIC' 
  | 'OBSERVATION' 
  | 'SPEED' 
  | 'DECISION' 
  | 'PSYCHOLOGY' 
  | 'COMBINATION'
  | 'VECTOR'
  | 'REAL_WORLD'
  | 'SUDOKU'
  | 'MEMORY_MATRIX'
  | 'NUMBER_SEQUENCE'
  | 'SHAPE_ROTATION'
  | 'ODD_ONE_OUT'
  | 'QUICK_MATH'
  | 'COLOR_CONFLICT'
  | 'SEQUENCE_MEMORY'
  | 'LOGIC_GRID'
  | 'WEIGHT_BALANCE';

export type StageId = 1 | 2 | 3 | 4 | 5;

export interface MindProfileStats {
  memory: number;            // 0 - 100
  logic: number;             // 0 - 100
  observation: number;       // 0 - 100
  reaction: number;          // 0 - 100
  patternRecognition: number;// 0 - 100
  decisionMaking: number;    // 0 - 100
}

export type PuzzleInputType = 
  | 'MULTIPLE_CHOICE'
  | 'SEQUENCE_RECALL'
  | 'GRID_SELECT'
  | 'SPEED_TARGET'
  | 'SLIDER_CHOICE'
  | 'MEMORY_FLASH';

export interface PuzzleOption {
  id: string;
  label: string;
  value: string | number;
  icon?: string;
  isCorrect?: boolean;
}

export interface Puzzle {
  id: string;
  category: CategoryType;
  title: string;
  description: string;
  inputType: PuzzleInputType;
  questionText: string;
  options?: PuzzleOption[];
  correctAnswer: string | number | (string | number)[];
  hint?: string;
  forgeDialogue: {
    intro: string;
    success: string;
    failure: string;
    deceptionWarning?: string;
  };
  timeLimitSeconds: number;
  difficulty: number; // 1 to 10
  metadata?: Record<string, any>;
}

export interface StageInfo {
  id: StageId;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  requiredXp: number;
  color: string;
  levelCount: number;
}

export interface LevelConfig {
  id: string;
  stageId: StageId;
  levelNumber: number;
  title: string;
  description: string;
  categories: CategoryType[];
  targetScoreToPass: number;
  lives: number;
  puzzleCount: number;
  focusModeAllowed?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category?: CategoryType | 'GENERAL';
}

export interface DailyChallengeState {
  date: string; // YYYY-MM-DD
  completed: boolean;
  score: number;
  timeSeconds: number;
  accuracy: number;
  rankPercentage: number;
}

export interface PlayerProgress {
  xp: number;
  level: number;
  rankTitle: string;
  totalScore: number;
  testsCompleted: number;
  totalAttempts: number;
  correctAnswers: number;
  fastestReactionMs: number;
  currentStreak: number;
  highestStreak: number;
  stats: MindProfileStats;
  completedLevels: string[]; // level IDs
  unlockedStages: StageId[];
  achievements: Achievement[];
  dailyHistory: Record<string, DailyChallengeState>;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  level: number;
  rankTitle: string;
  isPlayer?: boolean;
  avatarSeed: string;
}

// Sudoku Data Types
export type SudokuDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export interface SudokuCell {
  row: number;
  col: number;
  value: number; // 0 = empty, 1-9 = filled
  given: boolean; // true if initial puzzle number
  pencilMarks: number[]; // array of draft numbers 1-9
  isError?: boolean;
}
