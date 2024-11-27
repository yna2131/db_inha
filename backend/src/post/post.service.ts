import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
  ) {}

  async getAllPosts(): Promise<Posts[]> {
    return this.postRepository.find();
  }

  async getPost(post_id: number): Promise<Posts> {
    return this.postRepository.findOne({
      where: { post_id },
      relations: ['comments'],
    });
  }

  async createPost(postDto: Partial<Posts>): Promise<Posts> {
    const newPost = this.postRepository.create(postDto);
    return this.postRepository.save(newPost);
  }

  async updatePost(post_id: number, postDto: Partial<Posts>): Promise<Posts> {
    await this.postRepository.update(post_id, postDto);
    return this.getPost(post_id);
  }

  async deletePost(post_id: number): Promise<void> {
    await this.postRepository.delete(post_id);
  }
}
