export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export interface WinResult {
  winner: Player;
  winningCells: number[];
}

export type GameState =
  | { status: 'playing'; currentPlayer: Player }
  | { status: 'won'; winner: Player; winningCells: number[] }
  | { status: 'draw' };

const WINNING_COMBINATIONS: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board: Board): WinResult | null {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        winningCells: combination,
      };
    }
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

export function getGameState(board: Board, currentPlayer: Player): GameState {
  const winResult = checkWinner(board);
  if (winResult) {
    return {
      status: 'won',
      winner: winResult.winner,
      winningCells: winResult.winningCells,
    };
  }
  if (isDraw(board)) {
    return { status: 'draw' };
  }
  return { status: 'playing', currentPlayer };
}

export function getNextPlayer(current: Player): Player {
  return current === 'X' ? 'O' : 'X';
}

export function createEmptyBoard(): Board {
  return Array(9).fill(null);
}

export function isValidMove(board: Board, index: number): boolean {
  return index >= 0 && index < 9 && board[index] === null;
}
