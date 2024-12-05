import { Post } from 'src/posts/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2000, default: 'No content written' })
  content: string;

  // Relation to Posts
  @ManyToOne(() => Post, (post) => post.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' }) // This will add the foreign key column 'post_id'
  post: Post;

  // Self-referencing relationship
  @ManyToOne(() => Comments, (comment) => comment.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' }) // This will add the foreign key column 'comment_id'
  parentComment: Comments;

  @OneToMany(() => Comments, (comment) => comment.parentComment)
  comments: Comments[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}

export class CommentDto {
  @Column({ nullable: true })
  post_id: number;

  @Column({ nullable: true })
  comment_id: number;

  @Column({ length: 2000 })
  content: string;
}
