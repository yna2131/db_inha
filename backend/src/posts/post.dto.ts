import { Column } from 'typeorm';
import { Tags } from 'src/tags/tag.entity';

export class PostDto {
  @Column({ length: 30 })
  title: string;

  @Column({ length: 2000 })
  content: string;

  tags?: Tags[];
}
