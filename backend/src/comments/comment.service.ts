import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/posts.entity';
import { Repository } from 'typeorm';
import { CommentDto, Comments } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) { }

  async getAllComments(): Promise<Comments[]> {
    return this.commentRepository.find();
  }

  async getComment(id: number): Promise<Comments> {
    return this.commentRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
  }

  async createComment(commentDto: CommentDto): Promise<Comments> {
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

    const newComment = this.commentRepository.create(otherFields);

    if (comment_id) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: comment_id },
      });
      if (!parentComment) {
        throw new HttpException(
          `Comment with id ${comment_id} does not exist.`,
          HttpStatus.NOT_FOUND,
        );
      }
      newComment.parentComment = parentComment;
    } else {
      {
        const post = await this.postRepository.findOne({ where: { post_id } });
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
  ): Promise<Comments> {
    await this.commentRepository.update(id, commentDto);
    return this.getComment(id);
  }

  async deleteComment(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
