'use client';

interface GameStatusProps {
  currentPlayer: string;
  winner: string | null;
  isComplete: boolean;
}

export default function GameStatus({ currentPlayer, winner, isComplete }: GameStatusProps) {
  let message: string;
  let colorClass: string;
  let emoji: string;

  if (isComplete) {
    if (winner === 'draw') {
      message = "It's a draw!";
      colorClass = 'text-purple-600';
      emoji = '🤝';
    } else if (winner === 'X') {
      message = 'Player X wins!';
      colorClass = 'text-blue-600';
      emoji = '🎉';
    } else {
      message = 'Player O wins!';
      colorClass = 'text-rose-600';
      emoji = '🎉';
    }
  } else {
    message = `Player ${currentPlayer}'s turn`;
    colorClass = currentPlayer === 'X' ? 'text-blue-600' : 'text-rose-600';
    emoji = currentPlayer === 'X' ? '✕' : '○';
  }

  return (
    <div className="text-center py-4">
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100">
        <span className="text-2xl">{emoji}</span>
        <span className={`text-lg font-semibold ${colorClass}`}>{message}</span>
      </div>
    </div>
  );
}
