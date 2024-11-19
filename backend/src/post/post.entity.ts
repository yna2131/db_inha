import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ length: 2000 })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
