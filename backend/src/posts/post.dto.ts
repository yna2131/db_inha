import { Column } from 'typeorm';

export class PostDto {
  @Column({ length: 30 })
  title: string;

  @Column({ length: 2000 })
  content: string;
}

export class PostListDto {
  id: number;

  title: string;

  content: string;

  created_at: Date;

  user: {
    username: string;
  };

  commentCount: number;
}
