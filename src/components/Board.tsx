'use client';

import Cell from './Cell';
import { type Board as BoardType } from '@/lib/gameLogic';

interface BoardProps {
  board: BoardType;
  onCellClick: (index: number) => void;
  winningCells: number[];
  gameOver: boolean;
}

export default function Board({
  board,
  onCellClick,
  winningCells,
  gameOver,
}: BoardProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900/50 rounded-3xl border border-slate-700/50 shadow-2xl">
        {board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            index={index}
            isWinning={winningCells.includes(index)}
            isDisabled={gameOver}
            onClick={onCellClick}
          />
        ))}
      </div>
    </div>
  );
}
