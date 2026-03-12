import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { GameResult } from '../entity/GameResult';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/tictactoe.db';
const resolvedDbPath = path.resolve(process.cwd(), dbPath);

// Ensure directory exists
const dbDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: resolvedDbPath,
    entities: [GameResult],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}
