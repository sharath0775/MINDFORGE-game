import { useState } from 'react';
import { PlayerProgress, LevelConfig, CategoryType, Puzzle } from './types/game';
import { storage } from './services/storage';
import { generateLevelPuzzles, generatePuzzle } from './services/puzzleGenerators';
import { BackgroundCanvas } from './components/ui/BackgroundCanvas';
import { MainMenu } from './components/views/MainMenu';
import { StageSelect } from './components/views/StageSelect';
import { DailyChallengeView } from './components/views/DailyChallengeView';
import { TrainingView } from './components/views/TrainingView';
import { LeaderboardView } from './components/views/LeaderboardView';
import { AchievementsView } from './components/views/AchievementsView';
import { MindProfileModal } from './components/ui/MindProfileModal';
import { SettingsModal } from './components/views/SettingsModal';
import { PuzzleRunner } from './components/game/PuzzleRunner';
import { SudokuView } from './components/views/SudokuView';
import { ChallengeEngineView } from './components/views/ChallengeEngineView';
import { SurvivalRunner } from './components/game/SurvivalRunner';
import { SpeedRunRunner } from './components/game/SpeedRunRunner';

type ActiveView = 
  | 'MAIN_MENU'
  | 'STAGE_SELECT'
  | 'QUICK_PLAY'
  | 'SURVIVAL'
  | 'SPEED_RUN'
  | 'CHALLENGE_ENGINE'
  | 'SUDOKU'
  | 'PUZZLE_RUNNER'
  | 'DAILY_CHALLENGE'
  | 'TRAINING'
  | 'LEADERBOARD'
  | 'ACHIEVEMENTS';

export function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => storage.getProgress());
  const [currentView, setCurrentView] = useState<ActiveView>('MAIN_MENU');
  
  // Modals
  const [showMindProfile, setShowMindProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Active puzzle runner state
  const [activeLevelConfig, setActiveLevelConfig] = useState<LevelConfig | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [quickPlayPuzzles, setQuickPlayPuzzles] = useState<Puzzle[]>([]);

  const refreshProgress = () => {
    setProgress(storage.getProgress());
  };

  const handleSelectLevel = (level: LevelConfig, focusMode: boolean) => {
    setActiveLevelConfig(level);
    setIsFocusMode(focusMode);
    setCurrentView('PUZZLE_RUNNER');
  };

  const handleStartQuickPlay = () => {
    const categories: CategoryType[] = ['VECTOR', 'REAL_WORLD', 'QUICK_MATH', 'COLOR_CONFLICT', 'MEMORY_MATRIX'];
    const puzzles: Puzzle[] = categories.map(cat => generatePuzzle(cat, 5));
    setQuickPlayPuzzles(puzzles);
    setCurrentView('QUICK_PLAY');
  };

  const handleNavigate = (view: any) => {
    if (view === 'MIND_PROFILE') {
      setShowMindProfile(true);
    } else if (view === 'SETTINGS') {
      setShowSettings(true);
    } else if (view === 'QUICK_PLAY') {
      handleStartQuickPlay();
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Dynamic Animated Cyberpunk Background Canvas */}
      <BackgroundCanvas />

      {/* Main Container Content */}
      <main className="relative z-10 container mx-auto px-2 sm:px-4 py-6 sm:py-10 max-w-5xl">
        {currentView === 'MAIN_MENU' && (
          <MainMenu progress={progress} onNavigate={handleNavigate} />
        )}

        {currentView === 'STAGE_SELECT' && (
          <StageSelect
            progress={progress}
            onSelectLevel={handleSelectLevel}
            onBack={() => setCurrentView('MAIN_MENU')}
          />
        )}

        {currentView === 'QUICK_PLAY' && quickPlayPuzzles.length > 0 && (
          <PuzzleRunner
            levelId="quick_play_session"
            levelTitle="QUICK PLAY SESSION"
            puzzles={quickPlayPuzzles}
            targetScore={200}
            maxLives={3}
            onComplete={() => refreshProgress()}
            onExit={() => {
              refreshProgress();
              setCurrentView('MAIN_MENU');
            }}
          />
        )}

        {currentView === 'SURVIVAL' && (
          <SurvivalRunner
            onExit={() => {
              refreshProgress();
              setCurrentView('MAIN_MENU');
            }}
            onUpdateProgress={refreshProgress}
          />
        )}

        {currentView === 'SPEED_RUN' && (
          <SpeedRunRunner
            onExit={() => {
              refreshProgress();
              setCurrentView('MAIN_MENU');
            }}
            onUpdateProgress={refreshProgress}
          />
        )}

        {currentView === 'CHALLENGE_ENGINE' && (
          <ChallengeEngineView
            onBack={() => setCurrentView('MAIN_MENU')}
            onNavigateSudoku={() => setCurrentView('SUDOKU')}
          />
        )}

        {currentView === 'SUDOKU' && (
          <SudokuView
            onBack={() => setCurrentView('MAIN_MENU')}
            onUpdateProgress={refreshProgress}
          />
        )}

        {currentView === 'PUZZLE_RUNNER' && activeLevelConfig && (
          <PuzzleRunner
            levelId={activeLevelConfig.id}
            levelTitle={`${activeLevelConfig.title} (LVL ${activeLevelConfig.levelNumber})`}
            puzzles={generateLevelPuzzles(activeLevelConfig, 0)}
            targetScore={activeLevelConfig.targetScoreToPass}
            maxLives={activeLevelConfig.lives}
            isFocusMode={isFocusMode}
            onComplete={() => refreshProgress()}
            onExit={() => {
              refreshProgress();
              setCurrentView('STAGE_SELECT');
            }}
          />
        )}

        {currentView === 'DAILY_CHALLENGE' && (
          <DailyChallengeView
            progress={progress}
            onBack={() => setCurrentView('MAIN_MENU')}
            onUpdateProgress={refreshProgress}
          />
        )}

        {currentView === 'TRAINING' && (
          <TrainingView onBack={() => setCurrentView('MAIN_MENU')} />
        )}

        {currentView === 'LEADERBOARD' && (
          <LeaderboardView progress={progress} onBack={() => setCurrentView('MAIN_MENU')} />
        )}

        {currentView === 'ACHIEVEMENTS' && (
          <AchievementsView achievements={progress.achievements} onBack={() => setCurrentView('MAIN_MENU')} />
        )}
      </main>

      {/* Footer info */}
      <footer className="relative z-10 py-4 text-center font-mono-code text-[11px] text-slate-500 border-t border-slate-900 bg-[#05070c]/80 backdrop-blur-md">
        MINDFORGE SYSTEM v3.0.0 — PHASE 3 CATEGORIZED CHALLENGE FACILITY
      </footer>

      {/* Modals */}
      {showMindProfile && (
        <MindProfileModal
          stats={progress.stats}
          testsCompleted={progress.testsCompleted}
          fastestReactionMs={progress.fastestReactionMs}
          highestStreak={progress.highestStreak}
          onClose={() => setShowMindProfile(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onReset={() => refreshProgress()}
        />
      )}

    </div>
  );
}

export default App;
