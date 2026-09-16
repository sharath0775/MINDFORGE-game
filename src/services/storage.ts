import { PlayerProgress, MindProfileStats, Achievement, CategoryType } from '../types/game';

const SAVE_KEY = 'MINDFORGE_PLAYER_DATA_V1';

export interface ExtendedPlayerProgress extends PlayerProgress {
  survivalHighWave: number;
  speedRunMaxPuzzles: number;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_test', title: 'First Awakening', description: 'Complete your first mental test in MINDFORGE.', icon: 'Zap', unlocked: false },
  { id: 'perfect_memory', title: 'Eidetic Mind', description: 'Complete a Memory level without making a single mistake.', icon: 'Brain', unlocked: false, category: 'MEMORY' },
  { id: 'lightning_reflex', title: 'Sub-100ms Reflex', description: 'Achieve a reaction time of less than 200ms.', icon: 'Activity', unlocked: false, category: 'SPEED' },
  { id: 'pattern_master', title: 'Matrix Oracle', description: 'Reach a Pattern Recognition rating over 85.', icon: 'Grid', unlocked: false, category: 'PATTERN' },
  { id: 'no_mistakes', title: 'Flawless Execution', description: 'Complete an entire Stage with 100% accuracy.', icon: 'ShieldCheck', unlocked: false },
  { id: 'streak_10', title: 'Genius Resonance', description: 'Reach a Focus Streak of 10 consecutive correct answers.', icon: 'Flame', unlocked: false },
  { id: 'daily_first', title: 'Daily Operative', description: 'Complete your first Daily Challenge.', icon: 'Calendar', unlocked: false },
  { id: 'daily_streak_5', title: 'Consistency Core', description: 'Complete 5 Daily Challenges.', icon: 'Clock', unlocked: false },
  { id: 'stage_1_clear', title: 'Awakening Complete', description: 'Clear all levels in Stage 1 — Awakening.', icon: 'Unlock', unlocked: false },
  { id: 'stage_3_clear', title: 'Cognitive Superiority', description: 'Clear all levels in Stage 3 — Cognition.', icon: 'Award', unlocked: false },
  { id: 'the_forge_master', title: 'The Forge Ascendant', description: 'Conquer Stage 5 — The Forge.', icon: 'Crown', unlocked: false },
  { id: 'logic_overlord', title: 'Pure Logic', description: 'Solve 15 Logic Puzzles correctly.', icon: 'Cpu', unlocked: false, category: 'LOGIC' },
  { id: 'trap_immunity', title: 'Unshakeable Mind', description: 'Survive 5 Psychological traps without falling for deception.', icon: 'Eye', unlocked: false, category: 'PSYCHOLOGY' },
  { id: 'mind_profile_80', title: 'Polymath Status', description: 'Achieve an average score of 80+ across all cognitive stats.', icon: 'Star', unlocked: false },
  { id: 'survival_wave_10', title: 'Survival Specialist', description: 'Survive 10 consecutive waves in Survival Mode.', icon: 'Shield', unlocked: false },
  { id: 'speed_blitz_15', title: 'Speed Demon', description: 'Solve 15+ puzzles in a single 60-second Speed Run.', icon: 'Zap', unlocked: false }
];

export const DEFAULT_PROGRESS: ExtendedPlayerProgress = {
  xp: 0,
  level: 1,
  rankTitle: 'Beginner Operative',
  totalScore: 0,
  testsCompleted: 0,
  totalAttempts: 0,
  correctAnswers: 0,
  fastestReactionMs: 9999,
  currentStreak: 0,
  highestStreak: 0,
  survivalHighWave: 0,
  speedRunMaxPuzzles: 0,
  stats: {
    memory: 50,
    logic: 50,
    observation: 50,
    reaction: 50,
    patternRecognition: 50,
    decisionMaking: 50,
  },
  completedLevels: [],
  unlockedStages: [1],
  achievements: INITIAL_ACHIEVEMENTS,
  dailyHistory: {},
};

export function calculateRankTitle(level: number): string {
  if (level >= 50) return 'Forge God';
  if (level >= 30) return 'Mind Master';
  if (level >= 20) return 'Strategist';
  if (level >= 10) return 'Analyst';
  if (level >= 5) return 'Observer';
  return 'Beginner Operative';
}

export function xpForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.3, level - 1));
}

export class StorageService {
  private data: ExtendedPlayerProgress;

  constructor() {
    this.data = this.load();
  }

  public load(): ExtendedPlayerProgress {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return { ...DEFAULT_PROGRESS };
      const parsed = JSON.parse(raw);
      const mergedAchievements = INITIAL_ACHIEVEMENTS.map(initial => {
        const existing = parsed.achievements?.find((a: Achievement) => a.id === initial.id);
        return existing || initial;
      });
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        stats: { ...DEFAULT_PROGRESS.stats, ...parsed.stats },
        achievements: mergedAchievements,
      };
    } catch (e) {
      console.warn('Failed to load save data from LocalStorage:', e);
      return { ...DEFAULT_PROGRESS };
    }
  }

  public save(data?: ExtendedPlayerProgress): void {
    if (data) this.data = data;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save to LocalStorage:', e);
    }
  }

  public getProgress(): ExtendedPlayerProgress {
    return { ...this.data };
  }

  public addXp(amount: number): { leveledUp: boolean; newLevel: number; newTitle: string } {
    let oldLevel = this.data.level;
    this.data.xp += amount;

    let needed = xpForNextLevel(this.data.level);
    let leveledUp = false;

    while (this.data.xp >= needed) {
      this.data.xp -= needed;
      this.data.level += 1;
      leveledUp = true;
      needed = xpForNextLevel(this.data.level);
    }

    this.data.rankTitle = calculateRankTitle(this.data.level);
    this.save();

    return {
      leveledUp,
      newLevel: this.data.level,
      newTitle: this.data.rankTitle,
    };
  }

  public updateStats(categoryScoreMap: Partial<Record<CategoryType, number>>): MindProfileStats {
    const keysMap: Record<CategoryType, keyof MindProfileStats> = {
      MEMORY: 'memory',
      LOGIC: 'logic',
      OBSERVATION: 'observation',
      SPEED: 'reaction',
      PATTERN: 'patternRecognition',
      DECISION: 'decisionMaking',
      PSYCHOLOGY: 'logic',
      COMBINATION: 'memory',
      VECTOR: 'observation',
      REAL_WORLD: 'decisionMaking',
      SUDOKU: 'logic',
      MEMORY_MATRIX: 'memory',
      NUMBER_SEQUENCE: 'patternRecognition',
      SHAPE_ROTATION: 'observation',
      ODD_ONE_OUT: 'patternRecognition',
      QUICK_MATH: 'reaction',
      COLOR_CONFLICT: 'reaction',
      SEQUENCE_MEMORY: 'memory',
      LOGIC_GRID: 'logic',
      WEIGHT_BALANCE: 'logic',
    };

    Object.entries(categoryScoreMap).forEach(([cat, val]) => {
      const key = keysMap[cat as CategoryType];
      if (key && val !== undefined) {
        const current = this.data.stats[key];
        const updated = Math.round(current * 0.7 + val * 0.3);
        this.data.stats[key] = Math.max(10, Math.min(100, updated));
      }
    });

    this.save();
    return { ...this.data.stats };
  }

  public updateStreak(correct: boolean): number {
    if (correct) {
      this.data.currentStreak += 1;
      if (this.data.currentStreak > this.data.highestStreak) {
        this.data.highestStreak = this.data.currentStreak;
      }
    } else {
      this.data.currentStreak = 0;
    }
    this.save();
    return this.data.currentStreak;
  }

  public recordSurvivalRun(wavesSurvived: number, score: number): Achievement[] {
    if (wavesSurvived > this.data.survivalHighWave) {
      this.data.survivalHighWave = wavesSurvived;
    }
    this.data.testsCompleted += 1;
    this.data.totalScore += score;
    this.addXp(wavesSurvived * 30 + 50);

    const newlyUnlocked = this.checkAchievements();
    this.save();
    return newlyUnlocked;
  }

  public recordSpeedRun(puzzlesSolved: number, score: number): Achievement[] {
    if (puzzlesSolved > this.data.speedRunMaxPuzzles) {
      this.data.speedRunMaxPuzzles = puzzlesSolved;
    }
    this.data.testsCompleted += 1;
    this.data.totalScore += score;
    this.addXp(puzzlesSolved * 25 + 60);

    const newlyUnlocked = this.checkAchievements();
    this.save();
    return newlyUnlocked;
  }

  public recordTestResult(
    levelId: string,
    score: number,
    correctCount: number,
    totalCount: number,
    bestReactionMs?: number
  ): Achievement[] {
    this.data.testsCompleted += 1;
    this.data.totalScore += score;
    this.data.correctAnswers += correctCount;
    this.data.totalAttempts += totalCount;

    if (bestReactionMs && bestReactionMs < this.data.fastestReactionMs) {
      this.data.fastestReactionMs = bestReactionMs;
    }

    if (!this.data.completedLevels.includes(levelId)) {
      this.data.completedLevels.push(levelId);
    }

    this.checkStageUnlocks();
    const newAchievements = this.checkAchievements();
    this.save();

    return newAchievements;
  }

  public recordDailyChallenge(dateStr: string, score: number, timeSeconds: number, accuracy: number): Achievement[] {
    const rankPct = Math.max(1, Math.min(99, Math.round(100 - (score / 1500) * 80)));
    this.data.dailyHistory[dateStr] = {
      date: dateStr,
      completed: true,
      score,
      timeSeconds,
      accuracy,
      rankPercentage: rankPct,
    };

    this.data.testsCompleted += 1;
    this.data.totalScore += score;
    this.addXp(250);

    const newAchievements = this.checkAchievements();
    this.save();
    return newAchievements;
  }

  private checkStageUnlocks() {
    if (!this.data.unlockedStages.includes(2) && this.data.completedLevels.length >= 3) {
      this.data.unlockedStages.push(2);
    }
    if (!this.data.unlockedStages.includes(3) && this.data.completedLevels.length >= 7) {
      this.data.unlockedStages.push(3);
    }
    if (!this.data.unlockedStages.includes(4) && this.data.completedLevels.length >= 12) {
      this.data.unlockedStages.push(4);
    }
    if (!this.data.unlockedStages.includes(5) && this.data.completedLevels.length >= 18) {
      this.data.unlockedStages.push(5);
    }
  }

  private checkAchievements(): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    const unlock = (id: string) => {
      const ach = this.data.achievements.find(a => a.id === id);
      if (ach && !ach.unlocked) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        newlyUnlocked.push(ach);
      }
    };

    if (this.data.testsCompleted >= 1) unlock('first_test');
    if (this.data.fastestReactionMs < 200) unlock('lightning_reflex');
    if (this.data.stats.patternRecognition >= 85) unlock('pattern_master');
    if (this.data.highestStreak >= 10) unlock('streak_10');
    if (Object.keys(this.data.dailyHistory).length >= 1) unlock('daily_first');
    if (Object.keys(this.data.dailyHistory).length >= 5) unlock('daily_streak_5');
    if (this.data.survivalHighWave >= 10) unlock('survival_wave_10');
    if (this.data.speedRunMaxPuzzles >= 15) unlock('speed_blitz_15');

    const avgStats = Object.values(this.data.stats).reduce((a, b) => a + b, 0) / 6;
    if (avgStats >= 80) unlock('mind_profile_80');

    return newlyUnlocked;
  }

  public resetProgress() {
    this.data = { ...DEFAULT_PROGRESS };
    this.save();
  }
}

export const storage = new StorageService();
