// CommentService.ts
import { Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './create_comment_dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    async getCommentsByPostId(postId: number): Promise<Comment[]> {
        return this.commentRepository.find({ where: { post_id: postId } });
    }

    async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
        const comment = this.commentRepository.create(createCommentDto);
        return this.commentRepository.save(comment);
    }
}
