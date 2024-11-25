import { IsString, IsInt, Length, IsOptional, IsDate } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(1, 30)
  title: string;

  @IsString()
  @Length(1, 2000)
  content: string;

  @IsInt()
  user_id: number;

  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  updated_at?: Date;
}
