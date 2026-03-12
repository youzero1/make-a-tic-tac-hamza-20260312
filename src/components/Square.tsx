'use client';

interface SquareProps {
  value: string;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
  index: number;
}

export default function Square({ value, onClick, isWinning, disabled, index }: SquareProps) {
  const baseClasses =
    'w-24 h-24 md:w-28 md:h-28 text-4xl md:text-5xl font-bold flex items-center justify-center rounded-xl transition-all duration-200 border-2 select-none';

  const stateClasses = isWinning
    ? 'bg-yellow-300 border-yellow-500 scale-105 shadow-lg'
    : value
    ? 'bg-white border-gray-200 cursor-default'
    : disabled
    ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
    : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer hover:scale-105 shadow-sm hover:shadow-md';

  const textColor = value === 'X' ? 'text-blue-500' : value === 'O' ? 'text-rose-500' : '';

  return (
    <button
      className={`${baseClasses} ${stateClasses} ${textColor}`}
      onClick={onClick}
      disabled={disabled || !!value}
      aria-label={`Square ${index + 1}${value ? `: ${value}` : ''}`}
    >
      {value}
    </button>
  );
}
