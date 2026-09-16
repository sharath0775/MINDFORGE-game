import React from 'react';
import { PlayerProgress } from '../../types/game';
import { soundEngine } from '../../services/soundEngine';
import { Play, Calendar, Target, Brain, Award, Trophy, Settings, Cpu, Grid, Shield, Zap, Flame } from 'lucide-react';

interface MainMenuProps {
  progress: PlayerProgress;
  onNavigate: (view: 'STAGE_SELECT' | 'QUICK_PLAY' | 'SURVIVAL' | 'SPEED_RUN' | 'CHALLENGE_ENGINE' | 'SUDOKU' | 'DAILY_CHALLENGE' | 'TRAINING' | 'MIND_PROFILE' | 'LEADERBOARD' | 'ACHIEVEMENTS' | 'SETTINGS') => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ progress, onNavigate }) => {
  const handleBtnClick = (view: any) => {
    soundEngine.playClick();
    onNavigate(view);
  };

  const avgScore = Math.round(Object.values(progress.stats).reduce((a, b) => a + b, 0) / 6);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn px-2 sm:px-4">
      
      {/* Hero Facility Header */}
      <div className="glass-panel-glow p-5 sm:p-8 rounded-3xl border border-cyan-500/40 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 sm:space-y-3 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono-code text-[11px] font-bold tracking-widest uppercase">
            <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
            FACILITY STATUS: OPERATIONAL
          </div>

          <h1 className="font-orbitron text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-white tracking-widest neon-text-cyan">
            MINDFORGE
          </h1>

          <p className="font-mono-code text-xs text-slate-300 max-w-lg leading-relaxed">
            High-altitude psychological mind-training laboratory. Test synaptic speed, memory retention, logical deduction, and cognitive trap resilience.
          </p>
        </div>

        {/* Player Rank Card */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-purple-500/40 text-center w-full md:w-auto min-w-[200px] space-y-1.5 z-10">
          <span className="text-[10px] font-mono-code text-purple-400 uppercase tracking-widest block font-bold">OPERATIVE RANK</span>
          <div className="font-orbitron text-lg sm:text-xl font-bold text-slate-100">{progress.rankTitle}</div>
          <div className="font-mono-code text-xs text-cyan-400">LEVEL {progress.level} ({progress.xp} XP)</div>
          
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700 mt-2">
            <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, (progress.xp / 500) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* 5 GAME MODES SECTION */}
      <div className="space-y-3">
        <h2 className="font-orbitron text-xs sm:text-sm font-bold tracking-widest uppercase text-cyan-400 flex items-center gap-2">
          <Flame className="w-4 h-4" /> FACILITY GAME MODES
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          
          {/* 1. CAMPAIGN STAGES */}
          <button
            onClick={() => handleBtnClick('STAGE_SELECT')}
            className="glass-panel p-5 rounded-2xl border border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-950/30 transition-all duration-300 text-left group flex flex-col justify-between shadow-[0_0_15px_rgba(0,243,255,0.1)]"
          >
            <div className="flex items-center justify-between mb-3">
              <Play className="w-6 h-6 text-cyan-400 fill-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">MODE 1</span>
            </div>
            <div>
              <span className="font-orbitron text-base font-extrabold text-slate-100 block">STAGE CAMPAIGN</span>
              <span className="font-mono-code text-[11px] text-slate-400">5 Stages, 25 Level Progression.</span>
            </div>
          </button>

          {/* 2. QUICK PLAY */}
          <button
            onClick={() => handleBtnClick('QUICK_PLAY')}
            className="glass-panel p-5 rounded-2xl border border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-950/30 transition-all duration-300 text-left group flex flex-col justify-between shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">MODE 2</span>
            </div>
            <div>
              <span className="font-orbitron text-base font-extrabold text-slate-100 block">QUICK PLAY</span>
              <span className="font-mono-code text-[11px] text-slate-400">Instant 5-puzzle random session.</span>
            </div>
          </button>

          {/* 3. DAILY MIND */}
          <button
            onClick={() => handleBtnClick('DAILY_CHALLENGE')}
            className="glass-panel p-5 rounded-2xl border border-amber-500/50 hover:border-amber-400 hover:bg-amber-950/30 transition-all duration-300 text-left group flex flex-col justify-between shadow-[0_0_15px_rgba(245,158,11,0.1)]"
          >
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">MODE 3</span>
            </div>
            <div>
              <span className="font-orbitron text-base font-extrabold text-slate-100 block">DAILY MIND</span>
              <span className="font-mono-code text-[11px] text-slate-400">Date-seeded global daily test.</span>
            </div>
          </button>

          {/* 4. SURVIVAL MODE */}
          <button
            onClick={() => handleBtnClick('SURVIVAL')}
            className="glass-panel p-5 rounded-2xl border border-rose-500/50 hover:border-rose-400 hover:bg-rose-950/30 transition-all duration-300 text-left group flex flex-col justify-between shadow-[0_0_15px_rgba(244,63,94,0.1)]"
          >
            <div className="flex items-center justify-between mb-3">
              <Shield className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">MODE 4</span>
            </div>
            <div>
              <span className="font-orbitron text-base font-extrabold text-slate-100 block">SURVIVAL MODE</span>
              <span className="font-mono-code text-[11px] text-slate-400">Endless waves. 1 mistake = Game Over!</span>
            </div>
          </button>

          {/* 5. SPEED RUN */}
          <button
            onClick={() => handleBtnClick('SPEED_RUN')}
            className="glass-panel p-5 rounded-2xl border border-purple-500/50 hover:border-purple-400 hover:bg-purple-950/30 transition-all duration-300 text-left group flex flex-col justify-between shadow-[0_0_15px_rgba(168,85,247,0.1)]"
          >
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold">MODE 5</span>
            </div>
            <div>
              <span className="font-orbitron text-base font-extrabold text-slate-100 block">60s SPEED RUN</span>
              <span className="font-mono-code text-[11px] text-slate-400">Solve as many puzzles as possible in 60s.</span>
            </div>
          </button>

          {/* PRACTICE SANDBOX */}
          <button
            onClick={() => handleBtnClick('TRAINING')}
            className="glass-panel p-5 rounded-2xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 transition-all duration-300 text-left group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <Target className="w-6 h-6 text-slate-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 font-bold">PRACTICE</span>
            </div>
            <div>
              <span className="font-orbitron text-base font-extrabold text-slate-100 block">PRACTICE SANDBOX</span>
              <span className="font-mono-code text-[11px] text-slate-400">Train individual categories with 1-10 difficulty.</span>
            </div>
          </button>

        </div>
      </div>

      {/* CHALLENGE HUB & UTILITIES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        
        {/* MODULAR CHALLENGE HUB */}
        <button
          onClick={() => handleBtnClick('CHALLENGE_ENGINE')}
          className="sm:col-span-2 glass-panel p-5 rounded-2xl border border-purple-500/50 hover:border-purple-400 hover:bg-purple-950/30 transition-all duration-300 text-left group flex items-center justify-between shadow-[0_0_15px_rgba(168,85,247,0.1)]"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-7 h-7 text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <div>
              <span className="font-orbitron text-lg font-extrabold text-slate-100 block">MODULAR CHALLENGE HUB</span>
              <span className="font-mono-code text-xs text-slate-400">12 Categorized Brain Games (Vector, Sudoku, Logic Grid...)</span>
            </div>
          </div>
          <span className="font-orbitron text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
            EXPLORE →
          </span>
        </button>

        {/* SUDOKU PROTOCOL */}
        <button
          onClick={() => handleBtnClick('SUDOKU')}
          className="glass-panel p-5 rounded-2xl border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all duration-300 text-left group flex items-center gap-3"
        >
          <Grid className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
          <div>
            <span className="font-orbitron text-base font-bold text-slate-100 block">SUDOKU PROTOCOL</span>
            <span className="font-mono-code text-xs text-slate-400">Playable 9x9 Sudoku.</span>
          </div>
        </button>

        {/* MIND PROFILE */}
        <button
          onClick={() => handleBtnClick('MIND_PROFILE')}
          className="glass-panel p-5 rounded-2xl border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all duration-300 text-left group flex items-center gap-3"
        >
          <Brain className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
          <div>
            <span className="font-orbitron text-base font-bold text-slate-100 block">MIND PROFILE</span>
            <span className="font-mono-code text-xs text-cyan-400">Cognitive Radar: {avgScore}/100</span>
          </div>
        </button>

        {/* LEADERBOARD */}
        <button
          onClick={() => handleBtnClick('LEADERBOARD')}
          className="glass-panel p-5 rounded-2xl border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all duration-300 text-left group flex items-center gap-3"
        >
          <Trophy className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0" />
          <div>
            <span className="font-orbitron text-base font-bold text-slate-100 block">LEADERBOARD</span>
            <span className="font-mono-code text-xs text-slate-400">Global Rankings.</span>
          </div>
        </button>

        {/* ACHIEVEMENTS */}
        <button
          onClick={() => handleBtnClick('ACHIEVEMENTS')}
          className="glass-panel p-5 rounded-2xl border border-slate-700 hover:border-amber-500/50 hover:bg-amber-950/20 transition-all duration-300 text-left group flex items-center gap-3"
        >
          <Award className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0" />
          <div>
            <span className="font-orbitron text-base font-bold text-slate-100 block">ACHIEVEMENTS</span>
            <span className="font-mono-code text-xs text-slate-400">
              Unlocked {progress.achievements.filter(a => a.unlocked).length}/{progress.achievements.length} Badges
            </span>
          </div>
        </button>

      </div>

    </div>
  );
};
