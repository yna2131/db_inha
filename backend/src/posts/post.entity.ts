
import { Comment } from 'src/comments/comments.entity';
import { Tags } from 'src/tags/tag.entity';
import { Category } from 'src/category/category.entity';
import { User } from 'src/users/users.entity';
import { Column, Entity, JoinTable,JoinColumn, ManyToMany,ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ length: 2000, default: 'No content written' })
  content: string;


  @ManyToMany(() => Tags, (tag) => tag.post, { cascade: true })
  @JoinTable()
  tags: Tags[];

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @OneToMany(() => Comment, (comment) => comment.parentPost)
  comments: Comment[];

  @ManyToOne(() => Category, (category) => category.posts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
