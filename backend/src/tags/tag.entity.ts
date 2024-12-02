import { Post } from 'src/posts/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

  @ManyToMany(() => Post, (post) => post.tags, {
    onDelete: 'CASCADE',
  })
  posts: Post[];
}

export class TagDto {
  @Column({ nullable: true })
  post_id: number;

  @Column({ length: 255 })
  name: string;
}
