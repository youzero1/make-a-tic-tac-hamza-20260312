import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  board!: string;

  @Column({ type: 'text' })
  currentPlayer!: string;

  @Column({ type: 'text', nullable: true })
  winner!: string | null;

  @Column({ type: 'boolean', default: false })
  isComplete!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
