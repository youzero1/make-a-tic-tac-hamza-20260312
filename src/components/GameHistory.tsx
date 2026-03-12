'use client';

import { useEffect, useState } from 'react';

interface GameRecord {
  id: number;
  board: string;
  currentPlayer: string;
  winner: string | null;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function GameHistory() {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/games');
      if (!res.ok) throw new Error('Failed to load games');
      const data = await res.json();
      setGames(data);
    } catch (err) {
      setError('Could not load game history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const getResultLabel = (game: GameRecord) => {
    if (!game.isComplete) return { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700' };
    if (game.winner === 'draw') return { label: 'Draw', className: 'bg-purple-100 text-purple-700' };
    if (game.winner === 'X') return { label: 'X Wins', className: 'bg-blue-100 text-blue-700' };
    if (game.winner === 'O') return { label: 'O Wins', className: 'bg-rose-100 text-rose-700' };
    return { label: 'Unknown', className: 'bg-gray-100 text-gray-700' };
  };

  const getMiniBoard = (boardStr: string) => {
    try {
      return JSON.parse(boardStr) as string[];
    } catch {
      return Array(9).fill('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-4">{error}</p>;
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-4xl mb-2">📋</p>
        <p>No games played yet. Start a new game!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
      {games.map((game) => {
        const result = getResultLabel(game);
        const miniBoard = getMiniBoard(game.board);
        return (
          <div
            key={game.id}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Mini Board */}
            <div className="grid grid-cols-3 gap-0.5 flex-shrink-0">
              {miniBoard.map((cell, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 flex items-center justify-center text-xs font-bold rounded-sm ${
                    cell === 'X'
                      ? 'bg-blue-100 text-blue-500'
                      : cell === 'O'
                      ? 'bg-rose-100 text-rose-500'
                      : 'bg-gray-50'
                  }`}
                >
                  {cell}
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Game #{game.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${result.className}`}>
                  {result.label}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(game.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
