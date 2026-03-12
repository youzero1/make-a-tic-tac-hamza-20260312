'use client';

import { useState, useEffect, useCallback } from 'react';
import Board from '@/components/Board';
import Scoreboard from '@/components/Scoreboard';
import GameStatus from '@/components/GameStatus';
import {
  createEmptyBoard,
  getGameState,
  getNextPlayer,
  isValidMove,
  type Board as BoardType,
  type Player,
  type GameState,
} from '@/lib/gameLogic';

export interface Scores {
  xWins: number;
  oWins: number;
  draws: number;
}

export default function Home() {
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameState, setGameState] = useState<GameState>({
    status: 'playing',
    currentPlayer: 'X',
  });
  const [scores, setScores] = useState<Scores>({ xWins: 0, oWins: 0, draws: 0 });
  const [scoresLoading, setScoresLoading] = useState(true);
  const [resultSaved, setResultSaved] = useState(false);

  const fetchScores = useCallback(async () => {
    try {
      const res = await fetch('/api/scores');
      if (res.ok) {
        const data = await res.json();
        setScores(data);
      }
    } catch (err) {
      console.error('Failed to fetch scores:', err);
    } finally {
      setScoresLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const saveResult = useCallback(
    async (winner: string) => {
      try {
        const res = await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ winner }),
        });
        if (res.ok) {
          await fetchScores();
        }
      } catch (err) {
        console.error('Failed to save result:', err);
      }
    },
    [fetchScores]
  );

  useEffect(() => {
    if (!resultSaved && gameState.status !== 'playing') {
      setResultSaved(true);
      const winner =
        gameState.status === 'won' ? gameState.winner : 'draw';
      saveResult(winner);
    }
  }, [gameState, resultSaved, saveResult]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (gameState.status !== 'playing') return;
      if (!isValidMove(board, index)) return;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;

      const nextPlayer = getNextPlayer(currentPlayer);
      const newGameState = getGameState(newBoard, nextPlayer);

      setBoard(newBoard);
      setGameState(newGameState);
      if (newGameState.status === 'playing') {
        setCurrentPlayer(nextPlayer);
      }
    },
    [board, currentPlayer, gameState.status]
  );

  const handleRestart = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setGameState({ status: 'playing', currentPlayer: 'X' });
    setResultSaved(false);
  }, []);

  const winningCells =
    gameState.status === 'won' ? gameState.winningCells : [];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-white mb-2 tracking-tight">
          Tic Tac Toe
        </h1>
        <p className="text-center text-purple-300 mb-8 text-sm">
          Classic two-player strategy game
        </p>

        <Scoreboard scores={scores} loading={scoresLoading} />

        <GameStatus gameState={gameState} />

        <Board
          board={board}
          onCellClick={handleCellClick}
          winningCells={winningCells}
          gameOver={gameState.status !== 'playing'}
        />

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5"
          >
            Restart Game
          </button>
        </div>
      </div>
    </main>
  );
}
