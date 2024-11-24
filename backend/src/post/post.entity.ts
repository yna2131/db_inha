  import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

  @Entity()
  export class Posts {
    @PrimaryGeneratedColumn()
    post_id: number;

    @Column({ length: 30 })
    title: string;

    @Column({default: -1 })
    user_id: number;

    @Column({ length: 2000, default: 'No content written' })
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    updated_at: Date;
  }
