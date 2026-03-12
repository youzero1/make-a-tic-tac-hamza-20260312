'use client';

import { type CellValue } from '@/lib/gameLogic';

interface CellProps {
  value: CellValue;
  index: number;
  isWinning: boolean;
  isDisabled: boolean;
  onClick: (index: number) => void;
}

export default function Cell({
  value,
  index,
  isWinning,
  isDisabled,
  onClick,
}: CellProps) {
  const handleClick = () => {
    if (!isDisabled && !value) {
      onClick(index);
    }
  };

  const baseClasses =
    'relative flex items-center justify-center w-full aspect-square rounded-2xl text-5xl font-bold transition-all duration-200 cursor-pointer select-none border-2';

  const stateClasses = isWinning
    ? 'bg-yellow-300 border-yellow-400 shadow-lg shadow-yellow-300/50 scale-105'
    : value
    ? 'bg-slate-700 border-slate-600'
    : isDisabled
    ? 'bg-slate-800 border-slate-700 cursor-not-allowed'
    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-500 hover:scale-105 active:scale-95';

  const valueColor =
    value === 'X'
      ? isWinning
        ? 'text-blue-700'
        : 'text-blue-400'
      : value === 'O'
      ? isWinning
        ? 'text-red-700'
        : 'text-red-400'
      : '';

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled || !!value}
      className={`${baseClasses} ${stateClasses}`}
      aria-label={`Cell ${index + 1}${value ? `, ${value}` : ', empty'}`}
    >
      {value && (
        <span
          className={`${valueColor} drop-shadow-md`}
          style={{
            textShadow: isWinning
              ? '0 0 20px currentColor'
              : '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {value}
        </span>
      )}
    </button>
  );
}
