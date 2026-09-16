import React, { useState } from 'react';
import { PlayerProgress, StageId, LevelConfig } from '../../types/game';
import { CAMPAIGN_LEVELS } from '../../services/puzzleGenerators';
import { soundEngine } from '../../services/soundEngine';
import { Lock, CheckCircle2, Play, ArrowLeft, Shield, Sparkles } from 'lucide-react';

interface StageSelectProps {
  progress: PlayerProgress;
  onSelectLevel: (level: LevelConfig, isFocusMode: boolean) => void;
  onBack: () => void;
}

const STAGES = [
  { id: 1 as StageId, name: 'STAGE 1 — AWAKENING', desc: 'Introductory challenges calibrating memory, speed, and basic logic.', color: 'from-cyan-500/20 to-blue-600/20', borderColor: 'border-cyan-500/40' },
  { id: 2 as StageId, name: 'STAGE 2 — PERCEPTION', desc: 'Focus on observation, visual attention, and spatial rotation matrices.', color: 'from-emerald-500/20 to-teal-600/20', borderColor: 'border-emerald-500/40' },
  { id: 3 as StageId, name: 'STAGE 3 — COGNITION', desc: 'Complex mathematical deduction, truth/lie puzzles, and multi-step memory.', color: 'from-purple-500/20 to-indigo-600/20', borderColor: 'border-purple-500/40' },
  { id: 4 as StageId, name: 'STAGE 4 — DECEPTION', desc: 'Misleading patterns, distractors, and cognitive bias traps where intuition fails.', color: 'from-amber-500/20 to-orange-600/20', borderColor: 'border-amber-500/40' },
  { id: 5 as StageId, name: 'STAGE 5 — THE FORGE', desc: 'Extremely difficult mixed challenges combining all 8 cognitive dimensions.', color: 'from-rose-500/20 to-red-700/20', borderColor: 'border-rose-500/40' },
];

export const StageSelect: React.FC<StageSelectProps> = ({ progress, onSelectLevel, onBack }) => {
  const [selectedStageId, setSelectedStageId] = useState<StageId>(1);
  const [focusMode, setFocusMode] = useState(false);

  const currentStageInfo = STAGES.find(s => s.id === selectedStageId)!;
  const stageLevels = CAMPAIGN_LEVELS.filter(l => l.stageId === selectedStageId);
  const isStageUnlocked = progress.unlockedStages.includes(selectedStageId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="flex items-center gap-2 font-mono-code text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> RETURN TO HUB
        </button>

        {/* Focus Mode Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setFocusMode(!focusMode);
          }}
          className={`px-3 py-1.5 rounded-xl font-orbitron text-xs font-bold border transition-all flex items-center gap-2 ${
            focusMode
              ? 'bg-rose-950/80 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
              : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-500'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>FOCUS MODE (1 LIFE): {focusMode ? 'ENABLED' : 'DISABLED'}</span>
        </button>
      </div>

      {/* Stage Tab Selector Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {STAGES.map(stage => {
          const unlocked = progress.unlockedStages.includes(stage.id);
          const active = selectedStageId === stage.id;

          return (
            <button
              key={stage.id}
              onClick={() => {
                soundEngine.playClick();
                if (unlocked) setSelectedStageId(stage.id);
              }}
              disabled={!unlocked}
              className={`p-3 rounded-xl font-orbitron text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                active
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                  : unlocked
                  ? 'glass-panel border-slate-700 text-slate-300 hover:border-slate-500'
                  : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-mono-code">STAGE 0{stage.id}</span>
              <span className="truncate w-full">{stage.name.split(' — ')[1]}</span>
              {!unlocked && <Lock className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          );
        })}
      </div>

      {/* Selected Stage Banner */}
      <div className={`glass-panel-glow p-6 rounded-2xl border ${currentStageInfo.borderColor} bg-gradient-to-r ${currentStageInfo.color}`}>
        <h2 className="font-orbitron text-xl font-bold text-slate-100 tracking-wider mb-1">
          {currentStageInfo.name}
        </h2>
        <p className="font-mono-code text-xs text-slate-300">
          {currentStageInfo.desc}
        </p>
      </div>

      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stageLevels.map(lvl => {
          const isCompleted = progress.completedLevels.includes(lvl.id);

          return (
            <div
              key={lvl.id}
              className={`glass-panel p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                isCompleted
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-700 hover:border-cyan-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-code text-[11px] text-cyan-400 font-bold">
                    LEVEL {lvl.levelNumber} OF 5
                  </span>
                  {isCompleted && (
                    <span className="flex items-center gap-1 font-mono-code text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3" /> CLEARED
                    </span>
                  )}
                </div>

                <h3 className="font-orbitron text-base font-bold text-slate-100 mb-1">
                  {lvl.title}
                </h3>
                <p className="font-mono-code text-xs text-slate-400 mb-3">
                  {lvl.description}
                </p>

                {/* Categories badges */}
                <div className="flex flex-wrap gap-1.5">
                  {lvl.categories.map(cat => (
                    <span
                      key={cat}
                      className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="font-mono-code text-[11px] text-slate-400">
                  TARGET: <strong className="text-cyan-400">{lvl.targetScoreToPass} PTS</strong>
                </span>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectLevel(lvl, focusMode);
                  }}
                  className="px-4 py-2 rounded-xl font-orbitron text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,243,255,0.3)]"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" /> LAUNCH TEST
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
