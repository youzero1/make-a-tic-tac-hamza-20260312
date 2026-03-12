'use client';

import { type Scores } from '@/app/page';

interface ScoreboardProps {
  scores: Scores;
  loading: boolean;
}

export default function Scoreboard({ scores, loading }: ScoreboardProps) {
  return (
    <div className="mb-6 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/50 shadow-xl">
      <h2 className="text-center text-slate-300 text-sm font-semibold uppercase tracking-widest mb-3">
        Scoreboard
      </h2>
      {loading ? (
        <div className="flex justify-center">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <ScoreCard
            label="Player X"
            value={scores.xWins}
            color="text-blue-400"
            bgColor="bg-blue-900/30"
            borderColor="border-blue-700/40"
          />
          <ScoreCard
            label="Draws"
            value={scores.draws}
            color="text-yellow-400"
            bgColor="bg-yellow-900/30"
            borderColor="border-yellow-700/40"
          />
          <ScoreCard
            label="Player O"
            value={scores.oWins}
            color="text-red-400"
            bgColor="bg-red-900/30"
            borderColor="border-red-700/40"
          />
        </div>
      )}
    </div>
  );
}

function ScoreCard({
  label,
  value,
  color,
  bgColor,
  borderColor,
}: {
  label: string;
  value: number;
  color: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div
      className={`flex flex-col items-center py-3 px-2 rounded-xl border ${bgColor} ${borderColor}`}
    >
      <span className="text-slate-400 text-xs font-medium mb-1">{label}</span>
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
    </div>
  );
}
