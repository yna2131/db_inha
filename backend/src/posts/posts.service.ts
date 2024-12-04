import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostDto, PostListDto } from './post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getAllPosts(): Promise<PostListDto[]> {
    const rawPosts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(comments.id)', 'commentCount')
          .from('comments', 'comments')
          .where('comments.post_id = post.id');
      }, 'commentCount')
      .getRawMany();

    return rawPosts.map((post) => ({
      id: post.post_id,
      title: post.post_title,
      content: post.post_content,
      created_at: post.post_created_at,
      user: {
        username: post.user_username,
      },
      commentCount: parseInt(post.commentCount, 10),
    }));
  }

  async getPostById(id: number): Promise<Post> {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.created_at',
        'user.username',
        'comments.id',
        'comments.content',
        'comments.created_at',
        'comments.updated_at',
        'commentUser.username',
      ])
      .where('post.id = :id', { id })
      .getOne();
  }

  async createPost(postDto: PostDto, userId: number): Promise<Post> {
    const newPost = this.postRepository.create({
      ...postDto,
      user_id: userId,
    });
    return this.postRepository.save(newPost);
  }

  async updatePost(id: number, postDto: PostDto): Promise<Post> {
    await this.postRepository.update(id, postDto);
    return this.getPostById(id);
  }

  async deletePost(id: number, userId: number): Promise<void> {
    console.log(id, userId);
    const post = await this.postRepository.findOneBy({ id: id });
    console.log(post);
    if (!post) {
      throw new BadRequestException(`Post with id ${id} does not exist.`);
    } else if (post.user_id !== userId) {
      throw new UnauthorizedException();
    }
    await this.postRepository.delete(id);
  }
}
