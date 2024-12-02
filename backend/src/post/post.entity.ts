import { Comments } from 'src/comments/comment.entity';
import { Tags } from 'src/tags/tag.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ length: 2000, default: 'No content written' })
  content: string;

  @OneToMany(() => Comments, (comment) => comment.post)
  comments: Comments[];

  @ManyToMany(() => Tags, (tag) => tag.post)
  tags: Tags[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
