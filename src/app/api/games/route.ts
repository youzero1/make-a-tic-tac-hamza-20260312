import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../lib/database';
import { Game } from '../../../entity/Game';
import { createEmptyBoard } from '../../../lib/gameLogic';

export async function GET() {
  try {
    const ds = await getDataSource();
    const gameRepo = ds.getRepository(Game);
    const games = await gameRepo.find({
      order: { createdAt: 'DESC' },
    });
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const ds = await getDataSource();
    const gameRepo = ds.getRepository(Game);

    const newGame = gameRepo.create({
      board: JSON.stringify(createEmptyBoard()),
      currentPlayer: 'X',
      winner: null,
      isComplete: false,
    });

    const savedGame = await gameRepo.save(newGame);
    return NextResponse.json(savedGame, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
