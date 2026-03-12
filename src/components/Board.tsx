'use client';

import Square from './Square';

interface BoardProps {
  board: string[];
  onSquareClick: (index: number) => void;
  winningCombination: number[] | null;
  disabled: boolean;
}

export default function Board({ board, onSquareClick, winningCombination, disabled }: BoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3 p-4 bg-gray-100 rounded-2xl shadow-inner">
      {board.map((value, index) => (
        <Square
          key={index}
          index={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinning={winningCombination ? winningCombination.includes(index) : false}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
