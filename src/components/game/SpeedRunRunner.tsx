import { useState, useEffect, useRef } from 'react';
import { CategoryType, Puzzle } from '../../types/game';
import { generatePuzzle } from '../../services/puzzleGenerators';
import { soundEngine } from '../../services/soundEngine';
import { storage } from '../../services/storage';
import { ForgeAI } from '../ui/ForgeAI';
import { Zap, Clock, Trophy, RotateCcw, ArrowRight, Award, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeedRunRunnerProps {
  onExit: () => void;
  onUpdateProgress: () => void;
}

const FAST_CATEGORIES: CategoryType[] = [
  'QUICK_MATH', 'COLOR_CONFLICT', 'VECTOR', 'ODD_ONE_OUT',
  'NUMBER_SEQUENCE', 'SHAPE_ROTATION', 'SEQUENCE_MEMORY'
];

export const SpeedRunRunner = ({ onExit, onUpdateProgress }: SpeedRunRunnerProps) => {
  const [globalTimerSeconds, setGlobalTimerSeconds] = useState(60);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [score, setScore] = useState(0);
  
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  // Load next rapid puzzle
  const loadNextPuzzle = () => {
    const cat = FAST_CATEGORIES[Math.floor(Math.random() * FAST_CATEGORIES.length)];
    const puzzle = generatePuzzle(cat, 4);
    setCurrentPuzzle(puzzle);
  };

  useEffect(() => {
    loadNextPuzzle();
  }, []);

  // Global 60s Timer Tick
  useEffect(() => {
    if (isFinished) return;

    const interval = setInterval(() => {
      setGlobalTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          finishRun();
          return 0;
        }
        if (prev <= 5) soundEngine.playCountdown(prev === 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinished]);

  const finishRun = () => {
    setIsFinished(true);
    soundEngine.playLevelComplete();

    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    const xp = Math.round(score / 5) + puzzlesSolved * 20;
    setEarnedXp(xp);

    storage.recordSpeedRun(puzzlesSolved, score);
    onUpdateProgress();
  };

  const handleAnswerSubmit = (playerAnswer: string | number) => {
    if (isFinished || !currentPuzzle) return;

    const isCorrect = String(playerAnswer) === String(currentPuzzle.correctAnswer);

    if (isCorrect) {
      soundEngine.playCorrect();
      setPuzzlesSolved(prev => prev + 1);
      setScore(prev => prev + 150);

      storage.updateStats({ [currentPuzzle.category]: 85 });
      storage.updateStreak(true);
    } else {
      soundEngine.playError();
      storage.updateStreak(false);
    }

    loadNextPuzzle();
  };

  if (isFinished) {
    return (
      <div className="glass-panel-glow max-w-lg mx-auto rounded-2xl p-6 md:p-8 text-center animate-fadeIn border border-amber-500/50">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
          <Zap className="w-10 h-10" />
        </div>

        <h2 className="font-orbitron text-2xl font-bold tracking-wider mb-1 text-slate-100">
          60s SPEED RUN COMPLETE!
        </h2>
        <p className="font-mono-code text-xs text-amber-400 mb-6">TIME EXPIRED</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono-code text-slate-400 block">PUZZLES SOLVED</span>
            <span className="font-orbitron text-3xl font-bold text-amber-400">{puzzlesSolved}</span>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono-code text-slate-400 block">TOTAL SCORE</span>
            <span className="font-orbitron text-3xl font-bold text-cyan-400">{score}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 font-orbitron font-bold text-sm mb-6">
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
              setIsFinished(false);
              setGlobalTimerSeconds(60);
              setPuzzlesSolved(0);
              setScore(0);
              loadNextPuzzle();
            }}
            className="px-6 py-3 rounded-xl font-orbitron text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
          >
            <RotateCcw className="w-4 h-4" /> RESTART SPEED RUN
          </button>
        </div>
      </div>
    );
  }

  if (!currentPuzzle) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fadeIn">
      
      {/* Top Header Bar */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between border border-amber-500/40 bg-amber-950/20">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <span className="font-orbitron text-xs text-amber-400 font-bold block uppercase">60s SPEED RUN BLITZ</span>
            <span className="font-mono-code text-[11px] text-slate-300">SOLVED: {puzzlesSolved}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 font-orbitron font-bold text-sm">
          <div className="text-cyan-400">SCORE: {score}</div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
            globalTimerSeconds <= 10 ? 'bg-rose-950 border-rose-500 text-rose-400 animate-pulse' : 'bg-slate-900 border-slate-700 text-amber-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{globalTimerSeconds}s</span>
          </div>
        </div>
      </div>

      <ForgeAI
        dialogue={currentPuzzle.forgeDialogue.intro}
        type="SUCCESS"
        subStatus={`SPEED RUN — 60s CLOCK`}
      />

      {/* Main Sandbox */}
      <div className="glass-panel-glow p-6 md:p-8 rounded-2xl border border-amber-500/40 relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-orbitron text-lg font-bold text-slate-100">{currentPuzzle.title}</h3>
          <span className="font-mono-code text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/40">
            SPEED RUN
          </span>
        </div>

        <p className="text-xs text-slate-300 font-mono-code mb-6 leading-relaxed">
          {currentPuzzle.description}
        </p>

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

        {currentPuzzle.inputType !== 'SPEED_TARGET' && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center font-orbitron text-xl font-bold text-amber-300 mb-6">
            {currentPuzzle.questionText}
          </div>
        )}

        {currentPuzzle.options && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentPuzzle.options.map((opt, idx) => (
              <button
                key={opt.id || idx}
                onClick={() => handleAnswerSubmit(opt.value)}
                className="glass-panel p-4 rounded-xl text-left font-mono-code text-sm hover:border-amber-400 hover:bg-amber-950/40 transition-all duration-200 border border-slate-700 flex items-center justify-between group"
              >
                <span className="text-slate-200 group-hover:text-amber-300">{opt.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
