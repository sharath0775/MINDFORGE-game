import React, { useState, useEffect, useRef } from 'react';
import { Puzzle, CategoryType, Achievement } from '../../types/game';
import { soundEngine } from '../../services/soundEngine';
import { storage } from '../../services/storage';
import { ForgeAI } from '../ui/ForgeAI';
import { Clock, Heart, Flame, HelpCircle, Shield, Award, ArrowRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PuzzleRunnerProps {
  levelId: string;
  levelTitle: string;
  puzzles: Puzzle[];
  targetScore: number;
  maxLives?: number;
  isFocusMode?: boolean;
  onComplete: (score: number, passed: boolean) => void;
  onExit: () => void;
}

export const PuzzleRunner: React.FC<PuzzleRunnerProps> = ({
  levelId,
  levelTitle,
  puzzles,
  targetScore,
  maxLives = 3,
  isFocusMode = false,
  onComplete,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(isFocusMode ? 1 : maxLives);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [streakTitle, setStreakTitle] = useState<string | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(puzzles[0]?.timeLimitSeconds || 15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isMemoryFlashing, setIsMemoryFlashing] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHintText, setShowHintText] = useState(false);

  // Selected grid indices for GRID_SELECT puzzle
  const [selectedGridIndices, setSelectedGridIndices] = useState<number[]>([]);

  // Reaction timing
  const startTimeRef = useRef<number>(Date.now());
  const [fastestReactionMs, setFastestReactionMs] = useState<number>(9999);

  // Results state
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [levelUpData, setLevelUpData] = useState<{ leveledUp: boolean; newLevel: number; newTitle: string } | null>(null);

  const currentPuzzle = puzzles[currentIndex];

  // Initialize Puzzle state
  useEffect(() => {
    if (!currentPuzzle || isFinished) return;

    setShowHintText(false);
    setHintUsed(false);
    setSelectedGridIndices([]);
    setTimeLeft(currentPuzzle.timeLimitSeconds);
    startTimeRef.current = Date.now();

    if (currentPuzzle.inputType === 'MEMORY_FLASH' || currentPuzzle.inputType === 'GRID_SELECT') {
      setIsMemoryFlashing(true);
      setIsTimerRunning(false);

      const flashDuration = currentPuzzle.metadata?.flashDurationMs || 3000;
      const timer = setTimeout(() => {
        setIsMemoryFlashing(false);
        setIsTimerRunning(true);
        startTimeRef.current = Date.now();
      }, flashDuration);

      return () => clearTimeout(timer);
    } else {
      setIsMemoryFlashing(false);
      setIsTimerRunning(true);
    }
  }, [currentIndex, isFinished]);

  // Timer Tick
  useEffect(() => {
    if (!isTimerRunning || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswerSubmit('__TIMEOUT__');
          return 0;
        }
        if (prev <= 4) soundEngine.playCountdown(prev === 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isFinished, currentIndex]);

  // Handle Combo Streaks
  const updateStreakStatus = (newStreak: number) => {
    if (newStreak >= 10) {
      setStreakTitle('GENIUS MODE');
      soundEngine.playStreak(10);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } else if (newStreak >= 5) {
      setStreakTitle('SHARP');
      soundEngine.playStreak(5);
    } else if (newStreak >= 3) {
      setStreakTitle('FOCUSED');
      soundEngine.playStreak(3);
    } else {
      setStreakTitle(null);
    }
  };

  // Submit Answer
  const handleAnswerSubmit = (playerAnswer: string | number) => {
    setIsTimerRunning(false);
    const reactionTimeMs = Date.now() - startTimeRef.current;
    if (reactionTimeMs < fastestReactionMs) setFastestReactionMs(reactionTimeMs);

    let isCorrect = false;

    if (currentPuzzle.inputType === 'GRID_SELECT') {
      const selectedSorted = selectedGridIndices.sort((a, b) => a - b).join(',');
      isCorrect = selectedSorted === String(currentPuzzle.correctAnswer);
    } else {
      isCorrect = String(playerAnswer) === String(currentPuzzle.correctAnswer);
    }

    if (isCorrect) {
      soundEngine.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      updateStreakStatus(newStreak);
      setCorrectCount(prev => prev + 1);

      // Score calculation
      const baseScore = 100 * currentPuzzle.difficulty;
      const speedBonus = Math.max(0, Math.floor(timeLeft * 15));
      const streakMultiplier = 1 + newStreak * 0.1;
      const penaltyMultiplier = hintUsed ? 0.8 : 1.0;

      const puzzleScore = Math.round((baseScore + speedBonus) * streakMultiplier * penaltyMultiplier);
      setScore(prev => prev + puzzleScore);

      // Update category rating
      storage.updateStats({ [currentPuzzle.category]: Math.min(100, 60 + currentPuzzle.difficulty * 4) });
    } else {
      soundEngine.playError();
      setStreak(0);
      setStreakTitle(null);
      storage.updateStreak(false);

      const remainingLives = lives - 1;
      setLives(remainingLives);

      if (remainingLives <= 0) {
        finishLevel(false);
        return;
      }
    }

    // Move to next puzzle or complete
    if (currentIndex + 1 < puzzles.length) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 700);
    } else {
      setTimeout(() => {
        finishLevel(true);
      }, 700);
    }
  };

  const finishLevel = (completedAll: boolean) => {
    setIsFinished(true);
    setIsTimerRunning(false);

    const passed = completedAll && lives > 0 && score >= targetScore;
    if (passed) {
      soundEngine.playLevelComplete();
      const xpEarned = Math.round(score / 5) + 100;
      const levelUp = storage.addXp(xpEarned);
      setLevelUpData(levelUp);

      const unlockedAch = storage.recordTestResult(
        levelId,
        score,
        correctCount,
        puzzles.length,
        fastestReactionMs
      );
      if (unlockedAch.length > 0) {
        soundEngine.playAchievement();
        setNewAchievements(unlockedAch);
      }
    }

    onComplete(score, passed);
  };

  // Toggle Grid Selection
  const toggleGridIndex = (idx: number) => {
    soundEngine.playClick();
    setSelectedGridIndices(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  if (isFinished) {
    const passed = score >= targetScore && lives > 0;
    return (
      <div className="glass-panel-glow max-w-2xl mx-auto rounded-2xl p-6 md:p-8 text-center animate-fadeIn border border-cyan-500/40">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-cyan-500/20 border border-cyan-500/50">
          {passed ? (
            <Award className="w-10 h-10 text-emerald-400 animate-bounce" />
          ) : (
            <XCircle className="w-10 h-10 text-rose-400" />
          )}
        </div>

        <h2 className="font-orbitron text-2xl font-bold tracking-wider mb-1">
          {passed ? 'LEVEL EVALUATION PASSED' : 'TEST TERMINATED'}
        </h2>
        <p className="font-mono-code text-xs text-slate-400 mb-6">{levelTitle}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-center">
          <div className="glass-panel p-3 rounded-xl">
            <span className="text-[10px] font-mono-code text-slate-400 block">FINAL SCORE</span>
            <span className="font-orbitron text-2xl font-bold text-cyan-400">{score}</span>
          </div>
          <div className="glass-panel p-3 rounded-xl">
            <span className="text-[10px] font-mono-code text-slate-400 block">ACCURACY</span>
            <span className="font-orbitron text-2xl font-bold text-emerald-400">
              {Math.round((correctCount / puzzles.length) * 100)}%
            </span>
          </div>
          <div className="glass-panel p-3 rounded-xl">
            <span className="text-[10px] font-mono-code text-slate-400 block">BEST REFLEX</span>
            <span className="font-orbitron text-2xl font-bold text-rose-400">
              {fastestReactionMs < 9000 ? `${fastestReactionMs}ms` : '—'}
            </span>
          </div>
          <div className="glass-panel p-3 rounded-xl">
            <span className="text-[10px] font-mono-code text-slate-400 block">STREAK REACHED</span>
            <span className="font-orbitron text-2xl font-bold text-amber-400">{streak}</span>
          </div>
        </div>

        {/* Level Up Announcement */}
        {levelUpData?.leveledUp && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-purple-500/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-400 animate-spin" />
              <div className="text-left">
                <span className="font-orbitron text-xs text-amber-400 font-bold block uppercase">LEVEL UP PROMOTION</span>
                <span className="font-orbitron text-lg font-bold text-white">Level {levelUpData.newLevel} — {levelUpData.newTitle}</span>
              </div>
            </div>
          </div>
        )}

        {/* Unlocked Achievements */}
        {newAchievements.length > 0 && (
          <div className="mb-6 space-y-2">
            {newAchievements.map(ach => (
              <div key={ach.id} className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-orbitron text-xs text-cyan-400 font-bold block">{ach.title}</span>
                  <span className="text-xs text-slate-300">{ach.description}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onExit}
            className="px-6 py-3 rounded-xl font-orbitron text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-all"
          >
            RETURN TO HUB
          </button>
          {!passed && (
            <button
              onClick={() => {
                setCurrentIndex(0);
                setLives(isFocusMode ? 1 : maxLives);
                setScore(0);
                setStreak(0);
                setIsFinished(false);
              }}
              className="px-6 py-3 rounded-xl font-orbitron text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> RETRY TEST
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fadeIn">
      
      {/* Top Header Bar */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between border border-cyan-500/30">
        <div>
          <span className="font-orbitron text-xs text-cyan-400 font-bold block uppercase">{levelTitle}</span>
          <span className="font-mono-code text-[11px] text-slate-400">
            PUZZLE {currentIndex + 1} OF {puzzles.length} — {currentPuzzle.category}
          </span>
        </div>

        {/* Lives / Focus Mode */}
        <div className="flex items-center gap-4">
          {isFocusMode ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/50 text-rose-400 font-orbitron text-xs font-bold">
              <Shield className="w-3.5 h-3.5" /> FOCUS MODE (1 LIFE)
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {Array.from({ length: maxLives }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 transition-all ${
                    i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Timer */}
          <div className={`flex items-center gap-1.5 font-orbitron font-bold text-sm px-3 py-1 rounded-lg border ${
            timeLeft <= 4 ? 'bg-rose-950/80 border-rose-500 text-rose-400 animate-pulse' : 'bg-slate-900 border-slate-700 text-cyan-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Focus Streak Combo Banner */}
      {streakTitle && (
        <div className="glass-panel p-2 rounded-xl border border-amber-500/50 bg-amber-950/30 flex items-center justify-center gap-2 text-amber-400 font-orbitron font-bold text-sm tracking-widest animate-bounce">
          <Flame className="w-5 h-5 text-amber-400" />
          <span>FOCUS STREAK: {streakTitle} ({streak}x MULTIPLIER)</span>
        </div>
      )}

      {/* FORGE AI Guidance */}
      <ForgeAI
        dialogue={
          isMemoryFlashing
            ? 'FORGE: Memorize pattern layout now. Target disappears shortly...'
            : currentPuzzle.forgeDialogue.intro
        }
        type={isMemoryFlashing ? 'ANALYTICAL' : 'NEUTRAL'}
      />

      {/* Main Puzzle Sandbox Card */}
      <div className="glass-panel-glow p-6 md:p-8 rounded-2xl border border-cyan-500/40 relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-orbitron text-lg font-bold text-slate-100 tracking-wide">
            {currentPuzzle.title}
          </h3>
          <span className="font-mono-code text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
            DIFF LEVEL: {currentPuzzle.difficulty}/10
          </span>
        </div>

        <p className="text-sm text-slate-300 font-mono-code mb-6 leading-relaxed">
          {currentPuzzle.description}
        </p>

        {/* Puzzle Rendering by Input Type */}

        {/* 1. MEMORY FLASH DISPLAY */}
        {currentPuzzle.inputType === 'MEMORY_FLASH' && isMemoryFlashing && (
          <div className="py-8 text-center glass-panel rounded-xl border border-cyan-500/50 mb-6 bg-cyan-950/30 animate-pulse">
            <span className="font-mono-code text-xs text-cyan-400 block mb-2">NEURAL BUFFER ACTIVE</span>
            <div className="font-orbitron text-3xl font-extrabold text-white tracking-widest neon-text-cyan">
              {currentPuzzle.questionText}
            </div>
          </div>
        )}

        {/* 2. GRID SELECT INPUT */}
        {currentPuzzle.inputType === 'GRID_SELECT' && (
          <div className="mb-6 space-y-4">
            <div
              className="grid gap-3 mx-auto max-w-xs"
              style={{ gridTemplateColumns: `repeat(${currentPuzzle.metadata?.gridSize || 3}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: (currentPuzzle.metadata?.gridSize || 3) ** 2 }).map((_, idx) => {
                const isActiveInFlash = isMemoryFlashing && currentPuzzle.metadata?.activeIndices?.includes(idx);
                const isSelected = selectedGridIndices.includes(idx);

                return (
                  <button
                    key={idx}
                    disabled={isMemoryFlashing}
                    onClick={() => toggleGridIndex(idx)}
                    className={`aspect-square rounded-xl border transition-all duration-200 flex items-center justify-center font-orbitron font-bold text-sm ${
                      isActiveInFlash
                        ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_15px_#00f3ff] text-slate-950 scale-105'
                        : isSelected
                        ? 'bg-purple-600 border-purple-400 shadow-[0_0_15px_#a855f7] text-white'
                        : 'bg-slate-900/80 border-slate-700 hover:border-cyan-500/50 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {!isMemoryFlashing && (
              <button
                onClick={() => handleAnswerSubmit(selectedGridIndices.join(','))}
                className="w-full py-3 rounded-xl font-orbitron font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)]"
              >
                SUBMIT MATRIX SELECTION
              </button>
            )}
          </div>
        )}

        {/* 3. STROOP SPEED TARGET */}
        {currentPuzzle.inputType === 'SPEED_TARGET' && (
          <div className="py-6 text-center glass-panel rounded-xl border border-slate-700 mb-6">
            <span className="font-mono-code text-xs text-slate-400 block mb-2">TARGET SUBJECT</span>
            <div
              className="font-orbitron text-4xl font-black tracking-widest"
              style={{ color: currentPuzzle.metadata?.inkHex || '#ffffff' }}
            >
              {currentPuzzle.questionText}
            </div>
          </div>
        )}

        {/* Standard Question Text (Multiple Choice / Memory hidden prompt) */}
        {(currentPuzzle.inputType === 'MULTIPLE_CHOICE' || (!isMemoryFlashing && currentPuzzle.inputType === 'MEMORY_FLASH')) && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center font-orbitron text-xl font-bold text-cyan-300 mb-6">
            {currentPuzzle.questionText}
          </div>
        )}

        {/* Options List */}
        {!isMemoryFlashing && currentPuzzle.options && currentPuzzle.inputType !== 'GRID_SELECT' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentPuzzle.options.map((opt, idx) => (
              <button
                key={opt.id || idx}
                onClick={() => handleAnswerSubmit(opt.value)}
                className="glass-panel p-4 rounded-xl text-left font-mono-code text-sm hover:border-cyan-400 hover:bg-cyan-950/40 transition-all duration-200 border border-slate-700 flex items-center justify-between group"
              >
                <span className="text-slate-200 group-hover:text-cyan-300">{opt.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        )}

        {/* Hint Section */}
        {currentPuzzle.hint && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            {!showHintText ? (
              <button
                onClick={() => {
                  setShowHintText(true);
                  setHintUsed(true);
                  soundEngine.playClick();
                }}
                className="text-xs font-mono-code text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-4 h-4" /> REQUEST FORGE HINT (-20% SCORE)
              </button>
            ) : (
              <p className="text-xs font-mono-code text-amber-400 bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/30 w-full">
                💡 <strong>FORGE HINT:</strong> {currentPuzzle.hint}
              </p>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
