import { Comment } from 'src/comments/comments.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ length: 2000, default: 'No content written' })
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
