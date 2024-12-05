import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { Repository } from 'typeorm';
import { TagDto, Tags } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tags)
    private readonly tagRepository: Repository<Tags>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) { }

  async getAllTags(): Promise<Tags[]> {
    return this.tagRepository.find();
  }

  async getTag(id: number): Promise<Tags> {
    return this.tagRepository.findOne({
      where: { id },
      relations: ['post'],
    });
  }

  async createTag(tagDto: TagDto): Promise<Tags> {
    const { post_id, ...otherFields } = tagDto;

    const post = await this.postRepository.findOne({ where: { post_id } });
    if (!post) {
      throw new HttpException(
        `Post with id ${post_id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    let tag = await this.tagRepository.findOne({ where: { name: otherFields.name } });
    if (!tag) {
      tag = this.tagRepository.create({ ...otherFields });
      tag = await this.tagRepository.save(tag);
    }

    if (!tag.post) {
      tag.post = [post]; // Initialize as an array if not already set
    } else if (!tag.post.some((p) => p.post_id === post.post_id)) {
      tag.post.push(post); // Add the post if not already linked
    }

    return this.tagRepository.save(tag);
  }

  async updateTag(id: number, tagDto: Partial<TagDto>): Promise<Tags> {
    const existingTag = await this.tagRepository.findOne({ where: { id } });
    if (!existingTag) {
      throw new HttpException(
        `Tag with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.tagRepository.update(id, tagDto);
    return this.getTag(id);
  }

  async deleteTag(id: number): Promise<void> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new HttpException(
        `Tag with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Optionally remove associations with posts before deleting
    tag.post = [];
    await this.tagRepository.save(tag);

    await this.tagRepository.delete(id);
  }
  async linkTagToPost(tagName: string, post: Post): Promise<Tags> {
    let tag = await this.tagRepository.findOne({ where: { name: tagName } });
    if (!tag) {
      tag = this.tagRepository.create({ name: tagName });
      tag = await this.tagRepository.save(tag);
    }

    if (!tag.post) {
      tag.post = [post];
    } else if (!tag.post.some((p) => p.post_id === post.post_id)) {
      tag.post.push(post);
    }

    return this.tagRepository.save(tag);
  }

  async unlinkTagFromPost(tagName: string, post: Post): Promise<void> {
    const tag = await this.tagRepository.findOne({
      where: { name: tagName },
      relations: ['post'],
    });

    if (tag && tag.post) {
      tag.post = tag.post.filter((p) => p.post_id !== post.post_id);
      await this.tagRepository.save(tag);
    }
  }
}
