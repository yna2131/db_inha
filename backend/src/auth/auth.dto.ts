import { Column } from 'typeorm';

export class AuthDto {
  @Column({ length: 30 })
  email: string;

  @Column({ length: 30 })
  username: string;

  @Column({ length: 30 })
  password: string;
}
