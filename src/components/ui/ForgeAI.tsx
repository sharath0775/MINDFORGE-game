import React, { useState, useEffect } from 'react';
import { Cpu, Terminal } from 'lucide-react';

interface ForgeAIProps {
  dialogue: string;
  subStatus?: string;
  isGlitching?: boolean;
  type?: 'NEUTRAL' | 'SUCCESS' | 'WARNING' | 'ANALYTICAL';
}

export const ForgeAI: React.FC<ForgeAIProps> = ({
  dialogue,
  subStatus = 'FORGE AI SYSTEM — ONLINE',
  isGlitching = false,
  type = 'NEUTRAL',
}) => {
  const [displayedText, setDisplayedText] = useState('');

  // Typing effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');

    const timer = setInterval(() => {
      if (index < dialogue.length) {
        setDisplayedText(prev => prev + dialogue.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [dialogue]);

  const colorMap = {
    NEUTRAL: 'text-cyan-400 border-cyan-500/40 shadow-cyan-500/20',
    SUCCESS: 'text-emerald-400 border-emerald-500/40 shadow-emerald-500/20',
    WARNING: 'text-rose-400 border-rose-500/40 shadow-rose-500/20',
    ANALYTICAL: 'text-purple-400 border-purple-500/40 shadow-purple-500/20',
  };

  const orbColorMap = {
    NEUTRAL: 'from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(0,243,255,0.6)]',
    SUCCESS: 'from-emerald-400 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.6)]',
    WARNING: 'from-rose-500 to-red-700 shadow-[0_0_20px_rgba(244,63,94,0.6)]',
    ANALYTICAL: 'from-purple-500 to-indigo-600 shadow-[0_0_20px_rgba(168,85,247,0.6)]',
  };

  return (
    <div className={`glass-panel rounded-xl p-4 border transition-all duration-300 ${colorMap[type]}`}>
      <div className="flex items-start gap-3">
        {/* Animated AI Core Avatar */}
        <div className="relative flex-shrink-0 mt-1">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${orbColorMap[type]} flex items-center justify-center animate-pulse`}>
            <Cpu className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div className="absolute -inset-1 rounded-full border border-cyan-400/30 animate-ping opacity-30 pointer-events-none" />
        </div>

        {/* Dialogue Box */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-orbitron text-xs tracking-widest uppercase font-bold text-cyan-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              AI FORGE
            </span>
            <span className="font-mono-code text-[10px] text-slate-400 tracking-wider">
              {subStatus}
            </span>
          </div>

          <p className={`font-mono-code text-sm text-slate-200 leading-relaxed min-h-[40px] ${isGlitching ? 'animate-pulse text-cyan-200' : ''}`}>
            {displayedText}
            <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-blink" />
          </p>
        </div>
      </div>
    </div>
  );
};
