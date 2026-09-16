import React, { useState, useEffect } from 'react';
import { SudokuCell, SudokuDifficulty } from '../../types/game';
import { generateSudoku } from '../../services/sudokuGenerator';
import { soundEngine } from '../../services/soundEngine';
import { storage } from '../../services/storage';
import { ArrowLeft, Clock, Edit3, Eraser, HelpCircle, RotateCcw, Award, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SudokuViewProps {
  onBack: () => void;
  onUpdateProgress: () => void;
}

export const SudokuView: React.FC<SudokuViewProps> = ({ onBack, onUpdateProgress }) => {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>('MEDIUM');
  const [board, setBoard] = useState<SudokuCell[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const startNewPuzzle = (diff: SudokuDifficulty = difficulty) => {
    soundEngine.playClick();
    const { initialBoard, solutionBoard } = generateSudoku(diff);
    setBoard(initialBoard);
    setSolution(solutionBoard);
    setSelectedCell(null);
    setMistakes(0);
    setHintsUsed(0);
    setTimerSeconds(0);
    setIsCompleted(false);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    startNewPuzzle('MEDIUM');
  }, []);

  useEffect(() => {
    if (!isTimerRunning || isCompleted) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isCompleted) return;
    const { row, col } = selectedCell;
    const cell = board[row][col];
    if (cell.given) return;

    soundEngine.playClick();

    if (isPencilMode) {
      const newMarks = cell.pencilMarks.includes(num)
        ? cell.pencilMarks.filter(m => m !== num)
        : [...cell.pencilMarks, num].sort();

      const newBoard = board.map(r => r.map(c => ({ ...c })));
      newBoard[row][col].pencilMarks = newMarks;
      setBoard(newBoard);
    } else {
      const isCorrect = solution[row][col] === num;
      
      if (!isCorrect) {
        soundEngine.playError();
        setMistakes(prev => prev + 1);
      } else {
        soundEngine.playCorrect();
      }

      const newBoard = board.map(r => r.map(c => ({ ...c })));
      newBoard[row][col].value = num;
      newBoard[row][col].isError = !isCorrect;
      newBoard[row][col].pencilMarks = [];
      setBoard(newBoard);

      checkCompletion(newBoard);
    }
  };

  const handleErase = () => {
    if (!selectedCell || isCompleted) return;
    const { row, col } = selectedCell;
    if (board[row][col].given) return;

    soundEngine.playClick();
    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].value = 0;
    newBoard[row][col].isError = false;
    newBoard[row][col].pencilMarks = [];
    setBoard(newBoard);
  };

  const handleHint = () => {
    if (!selectedCell || isCompleted) return;
    const { row, col } = selectedCell;
    if (board[row][col].given || board[row][col].value === solution[row][col]) return;

    soundEngine.playClick();
    const correctVal = solution[row][col];
    setHintsUsed(prev => prev + 1);

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].value = correctVal;
    newBoard[row][col].isError = false;
    newBoard[row][col].pencilMarks = [];
    setBoard(newBoard);

    checkCompletion(newBoard);
  };

  const checkCompletion = (currentBoard: SudokuCell[][]) => {
    let allFilledCorrectly = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c].value !== solution[r][c]) {
          allFilledCorrectly = false;
          break;
        }
      }
    }

    if (allFilledCorrectly) {
      setIsCompleted(true);
      setIsTimerRunning(false);
      soundEngine.playLevelComplete();

      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}

      const baseXpMap: Record<SudokuDifficulty, number> = { EASY: 150, MEDIUM: 250, HARD: 400, EXPERT: 600 };
      const xp = Math.max(50, baseXpMap[difficulty] - mistakes * 20 - hintsUsed * 30);
      setEarnedXp(xp);

      storage.addXp(xp);
      storage.updateStats({ LOGIC: 85, PATTERN: 80, OBSERVATION: 80 });
      onUpdateProgress();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 animate-fadeIn px-2 sm:px-4">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="flex items-center gap-2 font-mono-code text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> RETURN TO HUB
        </button>

        {/* Difficulty Select */}
        <div className="flex gap-1 justify-center">
          {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as SudokuDifficulty[]).map(diff => (
            <button
              key={diff}
              onClick={() => {
                setDifficulty(diff);
                startNewPuzzle(diff);
              }}
              className={`px-2 py-1 rounded-lg font-orbitron text-[9px] sm:text-[10px] font-bold border transition-all ${
                difficulty === diff
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(0,243,255,0.4)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Top Game Status Bar */}
      <div className="glass-panel p-3 sm:p-4 rounded-xl flex items-center justify-between border border-cyan-500/30 font-mono-code text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Clock className="w-4 h-4" />
          <span>{formatTime(timerSeconds)}</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-slate-300">
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> MISTAKES: <strong className="text-rose-400">{mistakes}</strong>
          </span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> HINTS: <strong className="text-amber-400">{hintsUsed}</strong>
          </span>
        </div>
      </div>

      {/* 9x9 Sudoku Board - Mobile Responsive scaling (360px friendly) */}
      <div className="glass-panel-glow p-2 sm:p-4 rounded-2xl border border-cyan-500/40 mx-auto max-w-[340px] sm:max-w-md">
        <div className="grid grid-cols-9 gap-0.5 sm:gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
              const isSameRowOrCol = selectedCell && (selectedCell.row === rIdx || selectedCell.col === cIdx);
              const isSameNumber = selectedCell && board[selectedCell.row][selectedCell.col].value > 0 && cell.value === board[selectedCell.row][selectedCell.col].value;
              
              const borderRight = (cIdx + 1) % 3 === 0 && cIdx < 8 ? 'border-r-2 border-r-cyan-500/40' : '';
              const borderBottom = (rIdx + 1) % 3 === 0 && rIdx < 8 ? 'border-b-2 border-b-cyan-500/40' : '';

              return (
                <button
                  key={`${rIdx}_${cIdx}`}
                  onClick={() => setSelectedCell({ row: rIdx, col: cIdx })}
                  className={`aspect-square rounded flex items-center justify-center font-orbitron text-xs sm:text-base font-bold transition-all relative ${borderRight} ${borderBottom} ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 ring-2 ring-cyan-300 shadow-[0_0_12px_#00f3ff]'
                      : cell.isError
                      ? 'bg-rose-950 text-rose-400 border border-rose-500/60'
                      : isSameNumber
                      ? 'bg-cyan-900/60 text-cyan-200'
                      : isSameRowOrCol
                      ? 'bg-slate-900/90 text-slate-200'
                      : cell.given
                      ? 'bg-slate-900/40 text-cyan-300 font-extrabold'
                      : cell.value > 0
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-950/80 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  {cell.value > 0 ? (
                    cell.value
                  ) : cell.pencilMarks.length > 0 ? (
                    <div className="grid grid-cols-3 gap-0.5 text-[7px] sm:text-[8px] font-mono-code leading-none text-slate-400 p-0.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(m => (
                        <span key={m} className={cell.pencilMarks.includes(m) ? 'opacity-100' : 'opacity-0'}>
                          {m}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Control Action Buttons */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 max-w-[340px] sm:max-w-md mx-auto font-orbitron text-[10px] sm:text-xs font-bold">
        <button
          onClick={() => setIsPencilMode(!isPencilMode)}
          className={`py-2 rounded-xl border flex items-center justify-center gap-1 transition-all ${
            isPencilMode
              ? 'bg-purple-950 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" /> DRAFT {isPencilMode ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={handleErase}
          className="py-2 rounded-xl border bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 flex items-center justify-center gap-1 transition-all"
        >
          <Eraser className="w-3.5 h-3.5 text-rose-400" /> ERASE
        </button>

        <button
          onClick={handleHint}
          className="py-2 rounded-xl border bg-slate-900 border-slate-700 text-amber-400 hover:border-amber-500/50 flex items-center justify-center gap-1 transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5" /> HINT
        </button>

        <button
          onClick={() => startNewPuzzle()}
          className="py-2 rounded-xl border bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 flex items-center justify-center gap-1 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> RESTART
        </button>
      </div>

      {/* Number Input Keypad (1-9) */}
      <div className="grid grid-cols-9 gap-1 max-w-[340px] sm:max-w-md mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="py-2.5 rounded-xl glass-panel border border-slate-700 hover:border-cyan-400 font-orbitron font-extrabold text-sm sm:text-base text-slate-100 hover:text-cyan-300 transition-all active:scale-95 min-h-[44px]"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel-glow w-full max-w-md rounded-2xl p-6 text-center space-y-4 border border-emerald-500/50">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <h2 className="font-orbitron text-2xl font-bold text-slate-100">
              SUDOKU PUZZLE SOLVED!
            </h2>
            <p className="font-mono-code text-xs text-slate-400">
              Difficulty: {difficulty} | Time: {formatTime(timerSeconds)}
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-emerald-400 font-orbitron font-bold text-lg">
              +{earnedXp} XP EARNED
            </div>

            <button
              onClick={() => startNewPuzzle()}
              className="w-full py-3 rounded-xl font-orbitron font-extrabold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              PLAY NEW PUZZLE
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
