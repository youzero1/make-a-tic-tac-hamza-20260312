'use client';

import { type GameState } from '@/lib/gameLogic';

interface GameStatusProps {
  gameState: GameState;
}

export default function GameStatus({ gameState }: GameStatusProps) {
  const getStatusContent = () => {
    if (gameState.status === 'won') {
      const color =
        gameState.winner === 'X' ? 'text-blue-400' : 'text-red-400';
      return (
        <div className="flex items-center gap-2 justify-center">
          <span className="text-2xl">🎉</span>
          <span className="text-white font-semibold text-lg">
            Player{' '}
            <span className={`font-bold text-2xl ${color}`}>
              {gameState.winner}
            </span>{' '}
            wins!
          </span>
          <span className="text-2xl">🎉</span>
        </div>
      );
    }

    if (gameState.status === 'draw') {
      return (
        <div className="flex items-center gap-2 justify-center">
          <span className="text-2xl">🤝</span>
          <span className="text-white font-semibold text-lg">It's a draw!</span>
          <span className="text-2xl">🤝</span>
        </div>
      );
    }

    const playerColor =
      gameState.currentPlayer === 'X' ? 'text-blue-400' : 'text-red-400';
    return (
      <div className="flex items-center gap-2 justify-center">
        <span className="text-white text-lg">
          Player{' '}
          <span className={`font-bold text-2xl ${playerColor}`}>
            {gameState.currentPlayer}
          </span>
          's turn
        </span>
      </div>
    );
  };

  const bgColor =
    gameState.status === 'won'
      ? 'bg-green-900/30 border-green-700/50'
      : gameState.status === 'draw'
      ? 'bg-yellow-900/30 border-yellow-700/50'
      : gameState.currentPlayer === 'X'
      ? 'bg-blue-900/20 border-blue-700/30'
      : 'bg-red-900/20 border-red-700/30';

  return (
    <div
      className={`mb-4 px-6 py-3 rounded-2xl border ${bgColor} transition-all duration-300`}
    >
      {getStatusContent()}
    </div>
  );
}
