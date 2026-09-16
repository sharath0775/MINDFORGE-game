import { useState } from 'react';
import { CategoryType, Puzzle } from '../../types/game';
import { generatePuzzle } from '../../services/puzzleGenerators';
import { soundEngine } from '../../services/soundEngine';
import { PuzzleRunner } from '../game/PuzzleRunner';
import { Target, ArrowLeft, Play, Sliders } from 'lucide-react';

interface TrainingViewProps {
  onBack: () => void;
}

const CATEGORIES: { type: CategoryType; title: string; desc: string; color: string }[] = [
  { type: 'MEMORY', title: 'MEMORY CHALLENGE', desc: 'Sequence recall, grid flash, audio/visual chimes.', color: 'text-cyan-400 border-cyan-500/40' },
  { type: 'PATTERN', title: 'PATTERN RECOGNITION', desc: 'Shape/number series, symbol matrices, deceptive sequences.', color: 'text-purple-400 border-purple-500/40' },
  { type: 'LOGIC', title: 'LOGIC PUZZLES', desc: 'Mathematical deduction, truth/lie, spatial scale equilibrium.', color: 'text-indigo-400 border-indigo-500/40' },
  { type: 'OBSERVATION', title: 'OBSERVATION TEST', desc: 'Spatial matrix grid shift and anomaly detection.', color: 'text-emerald-400 border-emerald-500/40' },
  { type: 'SPEED', title: 'SPEED & REACTION', desc: 'Rapid Stroop interference, target interception.', color: 'text-rose-400 border-rose-500/40' },
  { type: 'DECISION', title: 'DECISION TEST', desc: 'Strategic trade-offs and expected value optimization.', color: 'text-blue-400 border-blue-500/40' },
  { type: 'PSYCHOLOGY', title: 'PSYCHOLOGICAL PUZZLES', desc: 'Cognitive bias traps and intuitive fallacies.', color: 'text-amber-400 border-amber-500/40' },
  { type: 'COMBINATION', title: 'MEMORY + LOGIC COMBINATION', desc: 'Multi-tiered cross-discipline code transformations.', color: 'text-teal-400 border-teal-500/40' },
];

export const TrainingView = ({ onBack }: TrainingViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('MEMORY');
  const [difficulty, setDifficulty] = useState<number>(5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trainingPuzzles, setTrainingPuzzles] = useState<Puzzle[]>([]);

  const handleStartTraining = () => {
    soundEngine.playClick();
    const puzzles: Puzzle[] = [];
    for (let i = 0; i < 5; i++) {
      puzzles.push(generatePuzzle(selectedCategory, difficulty));
    }
    setTrainingPuzzles(puzzles);
    setIsPlaying(true);
  };

  if (isPlaying && trainingPuzzles.length > 0) {
    return (
      <PuzzleRunner
        levelId={`train_${selectedCategory}`}
        levelTitle={`PRACTICE SANDBOX — ${selectedCategory}`}
        puzzles={trainingPuzzles}
        targetScore={200}
        maxLives={3}
        onComplete={() => {}}
        onExit={() => setIsPlaying(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
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

      <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/40 flex items-center justify-between">
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" /> PRACTICE SANDBOX
          </h2>
          <p className="font-mono-code text-xs text-slate-400 mt-1">
            Isolate and train specific cognitive domains with customizable difficulty levels.
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.type;
          return (
            <button
              key={cat.type}
              onClick={() => {
                soundEngine.playClick();
                setSelectedCategory(cat.type);
              }}
              className={`glass-panel p-4 rounded-xl text-left border transition-all duration-200 ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-orbitron text-sm font-bold ${cat.color}`}>{cat.title}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
              </div>
              <p className="font-mono-code text-xs text-slate-400">{cat.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Difficulty Slider & Launch */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-orbitron text-sm font-bold text-slate-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" /> DIFFICULTY INTENSITY: {difficulty} / 10
          </span>
          <span className="font-mono-code text-xs text-cyan-400">
            {difficulty <= 3 ? 'EASY' : difficulty <= 7 ? 'MODERATE' : 'EXTREME'}
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="10"
          value={difficulty}
          onChange={e => setDifficulty(Number(e.target.value))}
          className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        <button
          onClick={handleStartTraining}
          className="w-full py-4 rounded-xl font-orbitron font-extrabold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,243,255,0.4)]"
        >
          <Play className="w-4 h-4 fill-slate-950" /> LAUNCH PRACTICE SESSION
        </button>
      </div>

    </div>
  );
};
