import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async getPost(post_id: number): Promise<Post> {
    return this.postRepository.findOneBy({ post_id });
  }

  async createPost(postDto: Partial<Post>): Promise<Post> {
    const newPost = this.postRepository.create(postDto);
    return this.postRepository.save(newPost);
  }

  async updatePost(post_id: number, postDto: Partial<Post>): Promise<Post> {
    await this.postRepository.update(post_id, postDto);
    return this.getPost(post_id);
  }

  async deletePost(post_id: number): Promise<void> {
    await this.postRepository.delete(post_id);
  }
}
