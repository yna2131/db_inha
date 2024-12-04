import { IsString, IsInt, Length, IsOptional, IsDate } from 'class-validator';

export class CreateCommentDto {
    @IsInt()
    post_id: number;

    @IsInt()
    user_id?: number;

    @IsString()
    @Length(1, 2000)
    content: string;

    @IsDate()
    comment_created_at?: Date;
}
