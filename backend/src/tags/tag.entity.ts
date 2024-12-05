import { Post } from 'src/posts/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  post: Post[];
}

export class TagDto {
  @Column({ nullable: true })
  id: number;

  @Column({ length: 255 })
  name: string;
}
