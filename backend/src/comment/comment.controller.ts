// CommentController.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './create_comment_dto';
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    async createComment(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
        return this.commentService.createComment(createCommentDto);
    }

    @Get('post/:post_id')
    async getCommentsByPostId(@Param('post_id') postId: number): Promise<Comment[]> {
        return this.commentService.getCommentsByPostId(postId);
    }
}
