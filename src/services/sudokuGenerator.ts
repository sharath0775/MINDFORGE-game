import { SudokuCell, SudokuDifficulty } from '../types/game';

// Check if placing num at board[row][col] is valid
function isValid(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

// Backtracking solver
function solveBoard(board: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (const num of nums) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            if (solveBoard(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function generateSudoku(difficulty: SudokuDifficulty): {
  initialBoard: SudokuCell[][];
  solutionBoard: number[][];
} {
  // 1. Generate full solved 9x9 board
  const solutionBoard: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveBoard(solutionBoard);

  // 2. Clone board and remove cells based on difficulty
  const puzzleBoard: number[][] = solutionBoard.map(row => [...row]);

  const cellsToRemoveMap: Record<SudokuDifficulty, number> = {
    EASY: 30,     // 51 given cells remaining
    MEDIUM: 42,   // 39 given cells
    HARD: 50,     // 31 given cells
    EXPERT: 56,   // 25 given cells
  };

  const toRemove = cellsToRemoveMap[difficulty];
  let removed = 0;

  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  positions.sort(() => Math.random() - 0.5);

  for (const [r, c] of positions) {
    if (removed >= toRemove) break;
    puzzleBoard[r][c] = 0;
    removed++;
  }

  // 3. Transform into SudokuCell grid
  const initialBoard: SudokuCell[][] = puzzleBoard.map((row, r) =>
    row.map((val, c) => ({
      row: r,
      col: c,
      value: val,
      given: val !== 0,
      pencilMarks: [],
      isError: false,
    }))
  );

  return { initialBoard, solutionBoard };
}
