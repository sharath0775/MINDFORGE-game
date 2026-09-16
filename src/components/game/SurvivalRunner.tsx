import { useState, useEffect, useRef } from 'react';
import { CategoryType, Puzzle } from '../../types/game';
import { generatePuzzle } from '../../services/puzzleGenerators';
import { soundEngine } from '../../services/soundEngine';
import { storage } from '../../services/storage';
import { ForgeAI } from '../ui/ForgeAI';
import { Shield, Clock, Flame, RotateCcw, XCircle, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SurvivalRunnerProps {
  onExit: () => void;
  onUpdateProgress: () => void;
}

const CATEGORIES: CategoryType[] = [
  'VECTOR', 'REAL_WORLD', 'MEMORY_MATRIX', 'NUMBER_SEQUENCE',
  'SHAPE_ROTATION', 'ODD_ONE_OUT', 'QUICK_MATH', 'COLOR_CONFLICT',
  'SEQUENCE_MEMORY', 'LOGIC_GRID', 'WEIGHT_BALANCE', 'PSYCHOLOGY'
];

export const SurvivalRunner = ({ onExit, onUpdateProgress }: SurvivalRunnerProps) => {
  const [wave, setWave] = useState(1);
  const [score, setScore] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(12);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isMemoryFlashing, setIsMemoryFlashing] = useState(false);
  const [selectedGridIndices, setSelectedGridIndices] = useState<number[]>([]);
  
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const startTimeRef = useRef<number>(Date.now());

  // Load next wave puzzle
  const loadWavePuzzle = (currentWave: number) => {
    const diff = Math.min(10, 2 + Math.floor(currentWave * 0.5));
    const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const puzzle = generatePuzzle(cat, diff);

    setCurrentPuzzle(puzzle);
    setSelectedGridIndices([]);
    setTimeLeft(Math.max(5, puzzle.timeLimitSeconds - Math.floor(currentWave * 0.3)));
    startTimeRef.current = Date.now();

    if (puzzle.inputType === 'MEMORY_FLASH' || puzzle.inputType === 'GRID_SELECT') {
      setIsMemoryFlashing(true);
      setIsTimerRunning(false);

      const flashDuration = Math.max(1200, (puzzle.metadata?.flashDurationMs || 3000) - currentWave * 100);
      setTimeout(() => {
        setIsMemoryFlashing(false);
        setIsTimerRunning(true);
        startTimeRef.current = Date.now();
      }, flashDuration);
    } else {
      setIsMemoryFlashing(false);
      setIsTimerRunning(true);
    }
  };

  useEffect(() => {
    loadWavePuzzle(1);
  }, []);

  // Timer Tick
  useEffect(() => {
    if (!isTimerRunning || isGameOver || !currentPuzzle) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswerSubmit('__TIMEOUT__');
          return 0;
        }
        if (prev <= 3) soundEngine.playCountdown(prev === 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isGameOver, wave, currentPuzzle]);

  const handleAnswerSubmit = (playerAnswer: string | number) => {
    if (isGameOver || !currentPuzzle) return;
    setIsTimerRunning(false);

    let isCorrect = false;

    if (currentPuzzle.inputType === 'GRID_SELECT') {
      const selectedSorted = selectedGridIndices.sort((a, b) => a - b).join(',');
      isCorrect = selectedSorted === String(currentPuzzle.correctAnswer);
    } else {
      isCorrect = String(playerAnswer) === String(currentPuzzle.correctAnswer);
    }

    if (isCorrect) {
      soundEngine.playCorrect();
      const wavePoints = Math.round(100 * currentPuzzle.difficulty + timeLeft * 20);
      setScore(prev => prev + wavePoints);

      storage.updateStats({ [currentPuzzle.category]: Math.min(100, 70 + currentPuzzle.difficulty * 3) });
      storage.updateStreak(true);

      const nextWave = wave + 1;
      setWave(nextWave);

      setTimeout(() => {
        loadWavePuzzle(nextWave);
      }, 500);
    } else {
      soundEngine.playError();
      storage.updateStreak(false);
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsTimerRunning(false);

    const xp = Math.round(score / 5) + wave * 25;
    setEarnedXp(xp);

    storage.recordSurvivalRun(wave - 1, score);
    onUpdateProgress();
  };

  const toggleGridIndex = (idx: number) => {
    soundEngine.playClick();
    setSelectedGridIndices(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  if (isGameOver) {
    return (
      <div className="glass-panel-glow max-w-lg mx-auto rounded-2xl p-6 md:p-8 text-center animate-fadeIn border border-rose-500/50">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
          <XCircle className="w-10 h-10" />
        </div>

        <h2 className="font-orbitron text-2xl font-bold tracking-wider mb-1 text-slate-100">
          SURVIVAL PROTOCOL TERMINATED
        </h2>
        <p className="font-mono-code text-xs text-rose-400 mb-6">ONE MISTAKE INCURRED</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono-code text-slate-400 block">WAVES SURVIVED</span>
            <span className="font-orbitron text-3xl font-bold text-amber-400">{wave - 1}</span>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono-code text-slate-400 block">TOTAL SCORE</span>
            <span className="font-orbitron text-3xl font-bold text-cyan-400">{score}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-300 font-orbitron font-bold text-sm mb-6">
          +{earnedXp} XP REINFORCEMENT EARNED
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onExit}
            className="px-6 py-3 rounded-xl font-orbitron text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-all"
          >
            RETURN TO HUB
          </button>

          <button
            onClick={() => {
              setIsGameOver(false);
              setWave(1);
              setScore(0);
              loadWavePuzzle(1);
            }}
            className="px-6 py-3 rounded-xl font-orbitron text-xs font-bold bg-rose-500 hover:bg-rose-400 text-slate-950 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
          >
            <RotateCcw className="w-4 h-4" /> RETRY SURVIVAL
          </button>
        </div>
      </div>
    );
  }

  if (!currentPuzzle) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fadeIn">
      
      {/* Top Header */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between border border-rose-500/40 bg-rose-950/20">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-rose-400" />
          <div>
            <span className="font-orbitron text-xs text-rose-400 font-bold block uppercase">SURVIVAL MODE (1 LIFE)</span>
            <span className="font-mono-code text-[11px] text-slate-300">WAVE {wave} — {currentPuzzle.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 font-orbitron font-bold text-sm">
          <div className="text-amber-400">SCORE: {score}</div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
            timeLeft <= 3 ? 'bg-rose-950 border-rose-500 text-rose-400 animate-pulse' : 'bg-slate-900 border-slate-700 text-cyan-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      <ForgeAI
        dialogue={isMemoryFlashing ? 'FORGE: Retain memory matrix layout...' : currentPuzzle.forgeDialogue.intro}
        type="WARNING"
        subStatus={`SURVIVAL WAVE ${wave}`}
      />

      {/* Main Puzzle Sandbox */}
      <div className="glass-panel-glow p-6 md:p-8 rounded-2xl border border-rose-500/40 relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-orbitron text-lg font-bold text-slate-100">{currentPuzzle.title}</h3>
          <span className="font-mono-code text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
            WAVE {wave}
          </span>
        </div>

        <p className="text-xs text-slate-300 font-mono-code mb-6 leading-relaxed">
          {currentPuzzle.description}
        </p>

        {/* Input Renderers */}
        {currentPuzzle.inputType === 'MEMORY_FLASH' && isMemoryFlashing && (
          <div className="py-6 text-center glass-panel rounded-xl border border-rose-500/50 mb-6 bg-rose-950/40 animate-pulse">
            <span className="font-mono-code text-xs text-rose-400 block mb-2 font-bold">MEMORY BUFFER ACTIVE</span>
            <div className="font-orbitron text-3xl font-extrabold text-white tracking-widest">
              {currentPuzzle.questionText}
            </div>
          </div>
        )}

        {currentPuzzle.inputType === 'GRID_SELECT' && (
          <div className="mb-6 space-y-4">
            <div
              className="grid gap-2.5 mx-auto max-w-xs"
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
                    className={`aspect-square rounded-xl border transition-all flex items-center justify-center font-orbitron font-bold text-sm ${
                      isActiveInFlash
                        ? 'bg-rose-400 border-rose-300 text-slate-950 scale-105 shadow-[0_0_15px_#f43f5e]'
                        : isSelected
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-slate-900/80 border-slate-700 text-slate-400'
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
                className="w-full py-3 rounded-xl font-orbitron font-bold text-sm bg-rose-500 hover:bg-rose-400 text-slate-950 transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              >
                SUBMIT MATRIX SELECTION
              </button>
            )}
          </div>
        )}

        {(currentPuzzle.inputType === 'MULTIPLE_CHOICE' || (!isMemoryFlashing && currentPuzzle.inputType === 'MEMORY_FLASH')) && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center font-orbitron text-xl font-bold text-rose-300 mb-6">
            {currentPuzzle.questionText}
          </div>
        )}

        {!isMemoryFlashing && currentPuzzle.options && currentPuzzle.inputType !== 'GRID_SELECT' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentPuzzle.options.map((opt, idx) => (
              <button
                key={opt.id || idx}
                onClick={() => handleAnswerSubmit(opt.value)}
                className="glass-panel p-4 rounded-xl text-left font-mono-code text-sm hover:border-rose-400 hover:bg-rose-950/40 transition-all duration-200 border border-slate-700 flex items-center justify-between group"
              >
                <span className="text-slate-200 group-hover:text-rose-300">{opt.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
