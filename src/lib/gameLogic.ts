export type CellValue = 'X' | 'O' | '';
export type Board = CellValue[];

const WIN_COMBINATIONS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];

export function checkWinner(board: Board): { winner: 'X' | 'O' | null; winningCombination: number[] | null } {
  for (const combo of WIN_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as 'X' | 'O', winningCombination: combo };
    }
  }
  return { winner: null, winningCombination: null };
}

export function checkDraw(board: Board): boolean {
  return board.every((cell) => cell !== '') && checkWinner(board).winner === null;
}

export function isValidMove(board: Board, position: number): boolean {
  if (position < 0 || position > 8) return false;
  if (board[position] !== '') return false;
  return true;
}

export function createEmptyBoard(): Board {
  return ['', '', '', '', '', '', '', '', ''];
}

export function makeMove(board: Board, position: number, player: 'X' | 'O'): Board {
  const newBoard = [...board];
  newBoard[position] = player;
  return newBoard;
}
