'use client';

import { useState, useEffect, useCallback } from 'react';
import Board from '../components/Board';
import GameStatus from '../components/GameStatus';
import GameHistory from '../components/GameHistory';
import { checkWinner } from '../lib/gameLogic';

interface GameState {
  id: number | null;
  board: string[];
  currentPlayer: string;
  winner: string | null;
  isComplete: boolean;
}

const INITIAL_STATE: GameState = {
  id: null,
  board: ['', '', '', '', '', '', '', '', ''],
  currentPlayer: 'X',
  winner: null,
  isComplete: false,
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const winningCombination = gameState.isComplete && gameState.winner && gameState.winner !== 'draw'
    ? checkWinner(gameState.board as any).winningCombination
    : null;

  const startNewGame = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to create game');
      const data = await res.json();
      setGameState({
        id: data.id,
        board: JSON.parse(data.board),
        currentPlayer: data.currentPlayer,
        winner: data.winner,
        isComplete: data.isComplete,
      });
      setHistoryKey((k) => k + 1);
    } catch (err) {
      setError('Failed to start a new game. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startNewGame();
  }, []);

  const handleSquareClick = async (index: number) => {
    if (!gameState.id) return;
    if (gameState.isComplete) return;
    if (gameState.board[index] !== '') return;
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/games/${gameState.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: index }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to make move');
      }

      const data = await res.json();
      setGameState({
        id: data.id,
        board: JSON.parse(data.board),
        currentPlayer: data.currentPlayer,
        winner: data.winner,
        isComplete: data.isComplete,
      });

      if (data.isComplete) {
        setHistoryKey((k) => k + 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to make move.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-2">
          Tic Tac Toe
        </h1>
        <p className="text-purple-200 text-lg">Classic game, modern look</p>
      </div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* Game Panel */}
        <div className="flex-1 max-w-sm w-full mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20">
            {/* Game Status */}
            <GameStatus
              currentPlayer={gameState.currentPlayer}
              winner={gameState.winner}
              isComplete={gameState.isComplete}
            />

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Board */}
            <div className="my-6 flex justify-center">
              {loading && !gameState.id ? (
                <div className="flex justify-center items-center h-72">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : (
                <Board
                  board={gameState.board}
                  onSquareClick={handleSquareClick}
                  winningCombination={winningCombination}
                  disabled={gameState.isComplete || loading}
                />
              )}
            </div>

            {/* Player Legend */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-500 font-bold flex items-center justify-center text-lg">X</span>
                <span className="text-white/80 text-sm">Player X</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-500 font-bold flex items-center justify-center text-lg">O</span>
                <span className="text-white/80 text-sm">Player O</span>
              </div>
            </div>

            {/* New Game Button */}
            <button
              onClick={startNewGame}
              disabled={loading}
              className="w-full py-3 px-6 bg-white text-purple-700 font-bold text-lg rounded-xl shadow-lg hover:bg-purple-50 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></span>
                  Loading...
                </span>
              ) : (
                '🔄 New Game'
              )}
            </button>
          </div>
        </div>

        {/* History Panel */}
        <div className="flex-1 max-w-sm w-full mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">📋 Game History</h2>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="lg:hidden text-white/70 hover:text-white text-sm underline"
              >
                {showHistory ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className={`${showHistory ? 'block' : 'hidden'} lg:block`}>
              <GameHistory key={historyKey} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-purple-300 text-sm">
        Built with Next.js, TypeORM & SQLite
      </div>
    </main>
  );
}
