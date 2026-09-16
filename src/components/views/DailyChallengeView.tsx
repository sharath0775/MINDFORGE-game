import { useState } from 'react';
import { PlayerProgress, Puzzle } from '../../types/game';
import { generateDailyPuzzles } from '../../services/puzzleGenerators';
import { storage } from '../../services/storage';
import { soundEngine } from '../../services/soundEngine';
import { PuzzleRunner } from '../game/PuzzleRunner';
import { Calendar, ArrowLeft, Trophy, Clock, CheckCircle, Flame } from 'lucide-react';

interface DailyChallengeViewProps {
  progress: PlayerProgress;
  onBack: () => void;
  onUpdateProgress: () => void;
}

export const DailyChallengeView = ({ progress, onBack, onUpdateProgress }: DailyChallengeViewProps) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyRecord = progress.dailyHistory[todayStr];

  const [isPlaying, setIsPlaying] = useState(false);
  const [dailyPuzzles, setDailyPuzzles] = useState<Puzzle[]>([]);

  const handleStartDaily = () => {
    soundEngine.playClick();
    const puzzles = generateDailyPuzzles(todayStr);
    setDailyPuzzles(puzzles);
    setIsPlaying(true);
  };

  const handleDailyComplete = (score: number, passed: boolean) => {
    if (passed) {
      storage.recordDailyChallenge(todayStr, score, 45, 90);
      onUpdateProgress();
    }
  };

  if (isPlaying && dailyPuzzles.length > 0) {
    return (
      <PuzzleRunner
        levelId={`daily_${todayStr}`}
        levelTitle={`DAILY CHALLENGE — ${todayStr}`}
        puzzles={dailyPuzzles}
        targetScore={300}
        maxLives={3}
        onComplete={handleDailyComplete}
        onExit={() => setIsPlaying(false)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <button
        onClick={() => {
          soundEngine.playClick();
          onBack();
        }}
        className="flex items-center gap-2 font-mono-code text-xs text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> RETURN TO HUB
      </button>

      {/* Main Daily Card */}
      <div className="glass-panel-glow p-8 rounded-3xl border border-amber-500/40 text-center space-y-6">
        
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Calendar className="w-8 h-8" />
        </div>

        <div>
          <span className="font-mono-code text-xs text-amber-400 font-bold uppercase tracking-widest block mb-1">
            GLOBAL DAILY EVALUATION PROTOCOL
          </span>
          <h2 className="font-orbitron text-3xl font-extrabold text-slate-100">
            {todayStr}
          </h2>
          <p className="font-mono-code text-xs text-slate-400 max-w-md mx-auto mt-2">
            Every facility operative worldwide receives this identical 5-puzzle suite today. Complete it to secure daily XP and global ranking!
          </p>
        </div>

        {dailyRecord ? (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/40 text-left space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-orbitron font-bold text-sm">
              <CheckCircle className="w-5 h-5" /> DAILY EVALUATION COMPLETED TODAY
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="glass-panel p-3 rounded-xl">
                <span className="text-[10px] font-mono-code text-slate-400 block">DAILY SCORE</span>
                <span className="font-orbitron text-xl font-bold text-cyan-400">{dailyRecord.score}</span>
              </div>
              <div className="glass-panel p-3 rounded-xl">
                <span className="text-[10px] font-mono-code text-slate-400 block">ACCURACY</span>
                <span className="font-orbitron text-xl font-bold text-emerald-400">{dailyRecord.accuracy}%</span>
              </div>
              <div className="glass-panel p-3 rounded-xl">
                <span className="text-[10px] font-mono-code text-slate-400 block">GLOBAL RANK</span>
                <span className="font-orbitron text-xl font-bold text-amber-400">TOP {dailyRecord.rankPercentage}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono-code text-slate-300 space-y-1 text-left">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Flame className="w-4 h-4" /> REWARD REINFORCEMENT:
              </div>
              <p>• +250 XP upon successful completion</p>
              <p>• Daily streak progression counter update</p>
              <p>• Global operative leaderboard calculation</p>
            </div>

            <button
              onClick={handleStartDaily}
              className="w-full py-4 rounded-2xl font-orbitron text-base font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              START DAILY EVALUATION
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
