import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { GameResult } from '@/entity/GameResult';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(GameResult);

    const results = await repo.find();

    const scores = results.reduce(
      (acc, result) => {
        if (result.winner === 'X') acc.xWins++;
        else if (result.winner === 'O') acc.oWins++;
        else if (result.winner === 'draw') acc.draws++;
        return acc;
      },
      { xWins: 0, oWins: 0, draws: 0 }
    );

    return NextResponse.json(scores);
  } catch (error) {
    console.error('GET /api/scores error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scores' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { winner } = body;

    if (!winner || !['X', 'O', 'draw'].includes(winner)) {
      return NextResponse.json(
        { error: 'Invalid winner value. Must be X, O, or draw.' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(GameResult);

    const gameResult = repo.create({ winner });
    await repo.save(gameResult);

    return NextResponse.json({ success: true, id: gameResult.id }, { status: 201 });
  } catch (error) {
    console.error('POST /api/scores error:', error);
    return NextResponse.json(
      { error: 'Failed to save score' },
      { status: 500 }
    );
  }
}
