import { Column } from 'typeorm';

export class CommentDto {
  @Column({ nullable: true })
  post_id: number;

  @Column({ nullable: true })
  comment_id: number;

  @Column({ length: 2000 })
  content: string;
}
