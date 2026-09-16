import React from 'react';
import { MindProfileStats } from '../../types/game';
import { X, Brain, Activity, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

interface MindProfileModalProps {
  stats: MindProfileStats;
  testsCompleted: number;
  fastestReactionMs: number;
  highestStreak: number;
  onClose: () => void;
}

export const MindProfileModal: React.FC<MindProfileModalProps> = ({
  stats,
  testsCompleted,
  fastestReactionMs,
  highestStreak,
  onClose,
}) => {
  const dimensions = [
    { key: 'memory', label: 'MEMORY', score: stats.memory, color: '#00f3ff' },
    { key: 'logic', label: 'LOGIC', score: stats.logic, color: '#a855f7' },
    { key: 'observation', label: 'OBSERVATION', score: stats.observation, color: '#10b981' },
    { key: 'reaction', label: 'REACTION', score: stats.reaction, color: '#ef4444' },
    { key: 'patternRecognition', label: 'PATTERN RECOGNITION', score: stats.patternRecognition, color: '#f59e0b' },
    { key: 'decisionMaking', label: 'DECISION MAKING', score: stats.decisionMaking, color: '#3b82f6' },
  ];

  const avgScore = Math.round(dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length);

  // SVG Radar Polygon calculations
  const center = 120;
  const radius = 90;
  const numAxes = dimensions.length;

  const points = dimensions.map((d, i) => {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const r = (d.score / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Grid Rings
  const gridRings = [0.25, 0.5, 0.75, 1.0].map(scale => {
    return dimensions.map((_, i) => {
      const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
      const r = scale * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  });

  // Highlight highest and lowest dimensions
  const sortedDims = [...dimensions].sort((a, b) => b.score - a.score);
  const strongest = sortedDims[0];
  const weakest = sortedDims[sortedDims.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-3xl rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative border border-cyan-500/30 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Brain className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="font-orbitron text-2xl font-bold text-slate-100 tracking-wide flex items-center gap-2">
              NEURAL MIND PROFILE
            </h2>
            <p className="text-xs font-mono-code text-cyan-400">
              FACILITY PERFORMANCE ANALYSIS MATRIX
            </p>
          </div>
        </div>

        {/* Radar & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* SVG Radar Chart */}
          <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center border border-slate-700/50">
            <div className="text-center mb-2">
              <span className="font-mono-code text-xs text-slate-400 uppercase">Overall Mind Index</span>
              <div className="font-orbitron text-4xl font-extrabold text-cyan-400 neon-text-cyan">
                {avgScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
            </div>

            <svg width="240" height="240" className="overflow-visible">
              {/* Grid Background Rings */}
              {gridRings.map((ringPoints, idx) => (
                <polygon
                  key={idx}
                  points={ringPoints}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />
              ))}

              {/* Axis lines */}
              {dimensions.map((_, i) => {
                const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
                const x2 = center + radius * Math.cos(angle);
                const y2 = center + radius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(0, 243, 255, 0.15)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Radar Data Polygon */}
              <polygon
                points={points}
                fill="rgba(0, 243, 255, 0.25)"
                stroke="#00f3ff"
                strokeWidth="2"
                className="transition-all duration-700 ease-out"
              />

              {/* Data points */}
              {dimensions.map((d, i) => {
                const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
                const r = (d.score / 100) * radius;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);

                // Axis Labels
                const lx = center + (radius + 18) * Math.cos(angle);
                const ly = center + (radius + 18) * Math.sin(angle);

                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill={d.color} className="animate-ping" style={{ animationDuration: '3s' }} />
                    <circle cx={x} cy={y} r="3" fill="#ffffff" />
                    <text
                      x={lx}
                      y={ly}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {d.label.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Dimension Progress Bars */}
          <div className="glass-panel p-4 rounded-xl flex flex-col justify-between border border-slate-700/50 space-y-3">
            <h3 className="font-orbitron text-xs font-bold tracking-wider text-slate-300 uppercase mb-1">
              COGNITIVE DIMENSION RATINGS
            </h3>

            {dimensions.map(d => (
              <div key={d.key} className="space-y-1">
                <div className="flex justify-between text-xs font-mono-code">
                  <span className="text-slate-300">{d.label}</span>
                  <span className="font-bold" style={{ color: d.color }}>{d.score}</span>
                </div>
                <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${d.score}%`, backgroundColor: d.color, boxShadow: `0 0 8px ${d.color}` }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="glass-panel p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] font-mono-code text-slate-400 block">TESTS COMPLETED</span>
            <span className="font-orbitron text-xl font-bold text-cyan-400">{testsCompleted}</span>
          </div>
          <div className="glass-panel p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] font-mono-code text-slate-400 block">FASTEST REFLEX</span>
            <span className="font-orbitron text-xl font-bold text-rose-400">
              {fastestReactionMs < 9000 ? `${fastestReactionMs}ms` : '—'}
            </span>
          </div>
          <div className="glass-panel p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] font-mono-code text-slate-400 block">PEAK STREAK</span>
            <span className="font-orbitron text-xl font-bold text-amber-400">{highestStreak}</span>
          </div>
          <div className="glass-panel p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] font-mono-code text-slate-400 block">TOP DOMAIN</span>
            <span className="font-orbitron text-xs font-bold text-emerald-400 truncate block mt-1">
              {strongest.label}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2 text-slate-400 text-xs leading-relaxed">
          <HelpCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-300">Performance Disclaimer:</strong> Mind Profile statistics reflect performance within MINDFORGE game challenges only and are not scientifically valid IQ or clinical psychological measurements.
          </p>
        </div>

      </div>
    </div>
  );
};
