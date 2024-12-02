import { Optional } from '@nestjs/common';
import { Column } from 'typeorm';

export class UserDto {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Optional()
  username: string;

  @Column({ nullable: true })
  @Optional()
  password: string;
}
