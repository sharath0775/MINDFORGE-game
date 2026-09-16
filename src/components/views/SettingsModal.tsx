import { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { storage } from '../../services/storage';
import { Settings, Volume2, VolumeX, RotateCcw, X, ShieldAlert, Radio } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onReset: () => void;
}

export const SettingsModal = ({ onClose, onReset }: SettingsModalProps) => {
  const [sfxEnabled, setSfxEnabled] = useState(soundEngine.isEnabled());
  const [volume, setVolume] = useState(soundEngine.getVolume() * 100);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    soundEngine.setEnabled(next);
    if (next) soundEngine.playClick();
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol / 100);
  };

  const handleToggleAmbient = () => {
    if (ambientPlaying) {
      soundEngine.stopAmbient();
      setAmbientPlaying(false);
    } else {
      soundEngine.startAmbient();
      setAmbientPlaying(true);
    }
  };

  const handleResetData = () => {
    storage.resetProgress();
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-lg rounded-2xl p-6 md:p-8 relative border border-cyan-500/30 text-slate-100 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: '15s' }} />
          </div>
          <div>
            <h2 className="font-orbitron text-xl font-bold text-slate-100">FACILITY SETTINGS</h2>
            <p className="text-xs font-mono-code text-cyan-400">AUDIO & DATA CONTROLS</p>
          </div>
        </div>

        {/* Sound SFX */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono-code text-sm text-slate-200">
              {sfxEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
              <span>SOUND EFFECTS (SFX)</span>
            </div>

            <button
              onClick={handleToggleSfx}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                sfxEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          {/* Master Volume */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono-code text-slate-400">
              <span>MASTER VOLUME</span>
              <span>{Math.round(volume)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={e => handleVolumeChange(Number(e.target.value))}
              disabled={!sfxEnabled}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Ambient Cyber Drone */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 font-mono-code text-sm text-slate-200">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>AMBIENT CYBER DRONE</span>
            </div>

            <button
              onClick={handleToggleAmbient}
              className={`px-3 py-1 rounded-lg font-orbitron text-xs font-bold border transition-all ${
                ambientPlaying
                  ? 'bg-purple-950 border-purple-500 text-purple-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              {ambientPlaying ? 'PLAYING' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Reset Progress Section */}
        <div className="pt-4 border-t border-slate-800">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 rounded-xl font-orbitron text-xs font-bold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> RESET ALL PLAYER DATA
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 text-center space-y-3">
              <p className="font-mono-code text-xs text-rose-200 flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Are you sure? All progress, achievements, and stats will be permanently wiped!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleResetData}
                  className="flex-1 py-2 rounded-lg font-orbitron text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
                >
                  CONFIRM RESET
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 rounded-lg font-orbitron text-xs font-bold bg-slate-800 text-slate-300"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
