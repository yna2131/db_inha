import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { Repository } from 'typeorm';
import { Comment, CommentDto } from './comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getAllComments(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  async getCommentById(id: number): Promise<Comment> {
    return this.commentRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
  }

  async createComment(
    commentDto: CommentDto,
    userId: number,
  ): Promise<Comment> {
    const { post_id, comment_id, ...otherFields } = commentDto;

    if (!post_id && !comment_id) {
      throw new HttpException(
        'A comment must be linked to either a post or another comment.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (post_id && comment_id) {
      throw new HttpException(
        'A comment cannot be linked to both a post and another comment.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newComment = this.commentRepository.create({
      ...otherFields,
      user_id: userId,
    });

    if (comment_id) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: comment_id },
      });
      if (!parentComment) {
        throw new HttpException(
          `CommentDto with id ${comment_id} does not exist.`,
          HttpStatus.NOT_FOUND,
        );
      }
      newComment.parentComment = parentComment;
    } else {
      {
        const post = await this.postRepository.findOne({
          where: { id: post_id },
        });
        console.log(post);
        if (!post) {
          throw new HttpException(
            `Post with id ${post_id} does not exist.`,
            HttpStatus.NOT_FOUND,
          );
        }
        newComment.post = post;
      }
    }
    return this.commentRepository.save(newComment);
  }

  async updateComment(
    id: number,
    commentDto: Pick<CommentDto, 'content'>,
  ): Promise<Comment> {
    await this.commentRepository.update(id, commentDto);
    return this.getCommentById(id);
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    const comment = await this.getCommentById(id);
    if (!comment) {
      throw new BadRequestException(`Comment with id ${id} does not exist.`);
    } else if (comment.user_id !== userId) {
      throw new UnauthorizedException();
    }
    await this.commentRepository.delete(id);
  }
}
