import { Column } from 'typeorm';

export class PostDto {
  @Column({ length: 30 })
  title: string;

  @Column({ length: 2000 })
  content: string;
}
