import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    comment_id: number;

    @Column({ default: -1 })
    post_id: number;

    @Column({ default: -1 })
    user_id: number;

    @Column({ length: 2000, default: 'No content written' })
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    comment_created_at: Date;
}
