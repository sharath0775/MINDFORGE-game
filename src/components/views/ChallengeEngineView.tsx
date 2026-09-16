import { useState } from 'react';
import { CategoryType, Puzzle } from '../../types/game';
import { generatePuzzle } from '../../services/puzzleGenerators';
import { soundEngine } from '../../services/soundEngine';
import { PuzzleRunner } from '../game/PuzzleRunner';
import { Cpu, ArrowLeft, Play, Navigation, DollarSign, Grid, Hash, RotateCw, AlertTriangle, Zap, Palette, Layers, GitMerge, Scale, Eye, Brain } from 'lucide-react';

interface ChallengeEngineViewProps {
  onBack: () => void;
  onNavigateSudoku: () => void;
}

type CategoryTab = 'ALL' | 'MEMORY' | 'PATTERN' | 'LOGIC' | 'SPEED';

interface ChallengeItem {
  id: CategoryType;
  group: CategoryTab;
  name: string;
  title: string;
  desc: string;
  icon: any;
  color: string;
  isCustomView?: boolean;
}

const CHALLENGES: ChallengeItem[] = [
  // 1. MEMORY & PERCEPTION
  { id: 'SEQUENCE_MEMORY', group: 'MEMORY', name: 'SEQUENCE RECALL', title: 'SYMBOL CHAIN RECALL', desc: 'Reproduce exact symbol chains (▲ ● ■ ★ ◆), numbers, and mixed elements.', icon: Layers, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20' },
  { id: 'MEMORY_MATRIX', group: 'MEMORY', name: 'MEMORY MATRIX', title: 'QUANTUM CELL RECALL', desc: 'Memorize active cell node patterns across 4x4, 5x5, 6x6, and 8x8 matrices.', icon: Grid, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/20' },
  { id: 'MEMORY', group: 'MEMORY', name: 'MEMORY FLASH', title: 'NEURAL CHROMA FLASH', desc: 'High-density visual pattern, color chime, and sequence recall.', icon: Brain, color: 'text-blue-400 border-blue-500/40 bg-blue-950/20' },

  // 2. PATTERN & SPATIAL
  { id: 'VECTOR', group: 'PATTERN', name: 'VECTOR / ARROW', title: 'ARROW NAVIGATION', desc: 'Determine terminal arrow orientation, inversion, and missing compass vectors.', icon: Navigation, color: 'text-cyan-300 border-cyan-400/40 bg-cyan-950/20' },
  { id: 'SHAPE_ROTATION', group: 'PATTERN', name: 'SHAPE ROTATION', title: '2D SPATIAL TRANSFORMS', desc: 'Identify 90°, 180°, 270°, and mirrored 2D spatial transformations.', icon: RotateCw, color: 'text-rose-400 border-rose-500/40 bg-rose-950/20' },
  { id: 'NUMBER_SEQUENCE', group: 'PATTERN', name: 'NUMBER SEQUENCE', title: 'ADVANCED PATTERNS', desc: 'Quadratic series, geometric offsets, alternating dual rules, Fibonacci derivatives.', icon: Hash, color: 'text-amber-400 border-amber-500/40 bg-amber-950/20' },
  { id: 'ODD_ONE_OUT', group: 'PATTERN', name: 'ODD ONE OUT', title: 'RULE BREAKER ANOMALY', desc: 'Detect the single element violating the underlying mathematical set rule.', icon: AlertTriangle, color: 'text-teal-400 border-teal-500/40 bg-teal-950/20' },

  // 3. LOGIC & DEDUCTION
  { id: 'SUDOKU', group: 'LOGIC', name: 'SUDOKU PROTOCOL', title: '9x9 SUDOKU MODE', desc: 'Complete 9x9 logic board with Pencil Notes, Erase, Hints, and 4 Difficulties.', icon: Grid, color: 'text-purple-400 border-purple-500/40 bg-purple-950/20', isCustomView: true },
  { id: 'LOGIC_GRID', group: 'LOGIC', name: 'LOGIC GRID', title: 'DEDUCTION MATRIX', desc: 'Eliminate options and solve multi-attribute logic grid puzzles.', icon: GitMerge, color: 'text-purple-300 border-purple-400/40 bg-purple-950/20' },
  { id: 'WEIGHT_BALANCE', group: 'LOGIC', name: 'WEIGHT BALANCE', title: 'SCALE EQUILIBRIUM', desc: 'Substitute weights across multiple scales to deduce relative mass equivalence.', icon: Scale, color: 'text-amber-300 border-amber-400/40 bg-amber-950/20' },
  { id: 'REAL_WORLD', group: 'LOGIC', name: 'REAL WORLD', title: 'PRACTICAL REASONING', desc: 'Budgeting (₹500 - ₹175 - ₹120), train kinematics, and route optimization.', icon: DollarSign, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20' },

  // 4. SPEED & PSYCHOLOGY
  { id: 'QUICK_MATH', group: 'SPEED', name: 'QUICK MATH', title: 'RAPID CALCULATIONS', desc: 'High-speed addition, division, percentages (25% of 240), squares, and profit/loss.', icon: Zap, color: 'text-amber-400 border-amber-500/40 bg-amber-950/20' },
  { id: 'COLOR_CONFLICT', group: 'SPEED', name: 'REACTION TEST', title: 'STROOP INTERFERENCE', desc: 'Select optical ink color while ignoring deceptive semantic word text.', icon: Palette, color: 'text-pink-400 border-pink-500/40 bg-pink-950/20' },
  { id: 'PSYCHOLOGY', group: 'SPEED', name: 'MIND TRAP', title: 'COGNITIVE BIAS TRAPS', desc: 'Survive intuitive riddles and deceptive cognitive fallacies.', icon: Eye, color: 'text-rose-400 border-rose-500/40 bg-rose-950/20' },
];

export const ChallengeEngineView = ({ onBack, onNavigateSudoku }: ChallengeEngineViewProps) => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('ALL');
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);
  const [enginePuzzles, setEnginePuzzles] = useState<Puzzle[]>([]);

  const handleLaunchChallenge = (item: ChallengeItem) => {
    soundEngine.playClick();
    if (item.isCustomView) {
      onNavigateSudoku();
    } else {
      const puzzles: Puzzle[] = [];
      for (let i = 0; i < 5; i++) {
        puzzles.push(generatePuzzle(item.id, 5));
      }
      setEnginePuzzles(puzzles);
      setActiveCategory(item.id);
    }
  };

  const filteredChallenges = activeTab === 'ALL' 
    ? CHALLENGES 
    : CHALLENGES.filter(c => c.group === activeTab);

  if (activeCategory && enginePuzzles.length > 0) {
    return (
      <PuzzleRunner
        levelId={`engine_${activeCategory}`}
        levelTitle={`CHALLENGE ENGINE — ${activeCategory}`}
        puzzles={enginePuzzles}
        targetScore={250}
        maxLives={3}
        onComplete={() => {}}
        onExit={() => setActiveCategory(null)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn px-2 sm:px-4">
      
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

      <div className="glass-panel-glow p-5 sm:p-8 rounded-3xl border border-cyan-500/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 font-mono-code text-[11px] font-bold uppercase tracking-widest mb-2 border border-cyan-500/30">
          <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
          CATEGORIZED BRAIN TRAINERS
        </div>
        <h2 className="font-orbitron text-xl sm:text-3xl font-extrabold text-slate-100">
          MODULAR CHALLENGE HUB
        </h2>
        <p className="font-mono-code text-xs text-slate-400 mt-1">
          Select from 4 cognitive categories to target specific brain functions.
        </p>
      </div>

      {/* Category Tab Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 font-orbitron text-[11px] font-bold">
        {[
          { key: 'ALL', label: 'ALL MODULES' },
          { key: 'MEMORY', label: 'MEMORY' },
          { key: 'PATTERN', label: 'PATTERN' },
          { key: 'LOGIC', label: 'LOGIC' },
          { key: 'SPEED', label: 'SPEED & TRAPS' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              soundEngine.playClick();
              setActiveTab(tab.key as CategoryTab);
            }}
            className={`py-2.5 px-2 rounded-xl border transition-all text-center truncate ${
              activeTab === tab.key
                ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,243,255,0.4)]'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Categorized Challenge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredChallenges.map(item => {
          const IconComp = item.icon;

          return (
            <div
              key={item.id}
              className={`glass-panel p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 hover:scale-[1.02] ${item.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700">
                    <IconComp className="w-5 h-5 text-slate-100" />
                  </div>
                  <span className="font-orbitron text-[10px] font-bold tracking-wider text-slate-400">
                    {item.name}
                  </span>
                </div>

                <h3 className="font-orbitron text-sm sm:text-base font-bold text-slate-100 mb-1">
                  {item.title}
                </h3>
                <p className="font-mono-code text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <button
                onClick={() => handleLaunchChallenge(item)}
                className="w-full py-2.5 rounded-xl font-orbitron text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(0,243,255,0.3)]"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" /> LAUNCH MODULE
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
