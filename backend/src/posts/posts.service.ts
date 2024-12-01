import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostDto } from './post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user'],
      select: {
        user: {
          username: true,
        },
      },
    });
  }

  async getPostById(id: number): Promise<Post> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['user', 'comments'],
      select: {
        user: {
          username: true,
        },
      },
    });
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
    const post = await this.getPostById(id);
    if (!post) {
      throw new BadRequestException(`Post with id ${id} does not exist.`);
    } else if (post.user_id !== userId) {
      throw new UnauthorizedException();
    }
    await this.postRepository.delete(id);
  }
}
