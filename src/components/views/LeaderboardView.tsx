import { PlayerProgress, LeaderboardEntry } from '../../types/game';
import { soundEngine } from '../../services/soundEngine';
import { Trophy, ArrowLeft, ShieldCheck, Crown } from 'lucide-react';

interface LeaderboardViewProps {
  progress: PlayerProgress;
  onBack: () => void;
}

const MOCK_LEADERBOARD: Omit<LeaderboardEntry, 'rank'>[] = [
  { username: 'Agent_Spectre_99', score: 14820, level: 42, rankTitle: 'Mind Master', avatarSeed: 'S99' },
  { username: 'Quantum_Vortex', score: 12450, level: 36, rankTitle: 'Mind Master', avatarSeed: 'QV' },
  { username: 'Synapse_Echo', score: 10980, level: 28, rankTitle: 'Strategist', avatarSeed: 'SE' },
  { username: 'Neural_Kaiser', score: 9450, level: 24, rankTitle: 'Strategist', avatarSeed: 'NK' },
  { username: 'Axiom_Zero', score: 8120, level: 19, rankTitle: 'Analyst', avatarSeed: 'AZ' },
  { username: 'Cipher_Pulse', score: 6890, level: 15, rankTitle: 'Analyst', avatarSeed: 'CP' },
  { username: 'Valkyrie_Mind', score: 5400, level: 12, rankTitle: 'Analyst', avatarSeed: 'VM' },
  { username: 'Aether_Nova', score: 4100, level: 8, rankTitle: 'Observer', avatarSeed: 'AN' },
  { username: 'Vector_Protocol', score: 3200, level: 6, rankTitle: 'Observer', avatarSeed: 'VP' },
];

export const LeaderboardView = ({ progress, onBack }: LeaderboardViewProps) => {
  // Merge player score into global list
  const playerEntry: LeaderboardEntry = {
    rank: 0,
    username: 'OPERATIVE (YOU)',
    score: progress.totalScore,
    level: progress.level,
    rankTitle: progress.rankTitle,
    isPlayer: true,
    avatarSeed: 'YOU',
  };

  const combined = [...MOCK_LEADERBOARD, playerEntry]
    .sort((a, b) => b.score - a.score)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

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

      <div className="glass-panel-glow p-6 rounded-2xl border border-emerald-500/40 flex items-center justify-between">
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-emerald-400" /> FACILITY GLOBAL LEADERBOARD
          </h2>
          <p className="font-mono-code text-xs text-slate-400 mt-1">
            Real-time facility rankings for top active mind-training operatives.
          </p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 grid grid-cols-12 text-xs font-mono-code text-slate-400 font-bold uppercase tracking-wider">
          <div className="col-span-2 text-center">RANK</div>
          <div className="col-span-5">OPERATIVE</div>
          <div className="col-span-3">RANK TITLE</div>
          <div className="col-span-2 text-right">TOTAL SCORE</div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {combined.map(entry => (
            <div
              key={entry.username}
              className={`p-4 grid grid-cols-12 items-center transition-all ${
                entry.isPlayer
                  ? 'bg-cyan-950/60 border-l-4 border-cyan-400 text-cyan-200 font-bold'
                  : 'hover:bg-slate-800/40 text-slate-300'
              }`}
            >
              {/* Rank Badge */}
              <div className="col-span-2 flex items-center justify-center font-orbitron font-bold text-base">
                {entry.rank === 1 ? (
                  <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
                ) : entry.rank === 2 ? (
                  <span className="text-slate-300">#2</span>
                ) : entry.rank === 3 ? (
                  <span className="text-amber-600">#3</span>
                ) : (
                  <span className="text-slate-500 text-xs">#{entry.rank}</span>
                )}
              </div>

              {/* Username */}
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono-code font-bold text-cyan-400">
                  {entry.avatarSeed.slice(0, 2)}
                </div>
                <div>
                  <span className="font-mono-code text-sm block">{entry.username}</span>
                  <span className="font-mono-code text-[10px] text-slate-400">LVL {entry.level}</span>
                </div>
              </div>

              {/* Rank Title */}
              <div className="col-span-3">
                <span className="font-orbitron text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-purple-300 inline-block">
                  {entry.rankTitle}
                </span>
              </div>

              {/* Score */}
              <div className="col-span-2 text-right font-orbitron font-bold text-cyan-400">
                {entry.score.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
