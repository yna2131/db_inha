import { Post } from 'src/posts/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, unique: true })
  name: string;

  @Column({ length: 1000 })
  description: string;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
