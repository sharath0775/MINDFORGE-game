import { Achievement } from '../../types/game';
import { soundEngine } from '../../services/soundEngine';
import { Award, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

interface AchievementsViewProps {
  achievements: Achievement[];
  onBack: () => void;
}

export const AchievementsView = ({ achievements, onBack }: AchievementsViewProps) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

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

      <div className="glass-panel-glow p-6 rounded-2xl border border-amber-500/40 flex items-center justify-between">
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" /> ACHIEVEMENT BADGES
          </h2>
          <p className="font-mono-code text-xs text-slate-400 mt-1">
            Unlocked {unlockedCount} of {achievements.length} facility honors.
          </p>
        </div>

        <div className="text-right font-orbitron text-xl font-bold text-amber-400">
          {Math.round((unlockedCount / achievements.length) * 100)}%
        </div>
      </div>

      {/* Grid of Achievement Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map(ach => (
          <div
            key={ach.id}
            className={`glass-panel p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
              ach.unlocked
                ? 'border-amber-500/40 bg-amber-950/10'
                : 'border-slate-800 opacity-60'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${
              ach.unlocked
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-600'
            }`}>
              {ach.unlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`font-orbitron text-sm font-bold ${ach.unlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                  {ach.title}
                </h3>
                {ach.unlocked && (
                  <span className="flex items-center gap-1 font-mono-code text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> UNLOCKED
                  </span>
                )}
              </div>
              <p className="font-mono-code text-xs text-slate-400 leading-relaxed">
                {ach.description}
              </p>
              {ach.unlockedAt && (
                <span className="font-mono-code text-[10px] text-slate-500 block pt-1">
                  UNLOCKED: {new Date(ach.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
