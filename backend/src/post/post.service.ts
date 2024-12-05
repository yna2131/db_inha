import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './post.entity';
import { Tags } from 'src/tags/tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(Tags)
    private readonly tagRepository: Repository<Tags>,
  ) {}
  private extractHashtags(content: string): string[] {
    const regex = /#\w+/g;
    return content.match(regex) || [];
  }

  private async processTags(post: Posts, hashtags: string[]): Promise<void> {
    const tags = await Promise.all(
      hashtags.map(async (hashtag) => {
        let tag = await this.tagRepository.findOne({ where: { name: hashtag } });
        if (!tag) {
          tag = this.tagRepository.create({ name: hashtag });
          tag = await this.tagRepository.save(tag);
        }
        return tag;
      }),
    );
    post.tags = tags;
    await this.postRepository.save(post);
  }
  async getAllPosts(): Promise<Posts[]> {
    return this.postRepository.find({
      relations: ['comments', 'tags'],
    });
  }

  async getPost(post_id: number): Promise<Posts> {
    return this.postRepository.findOne({
      where: { post_id },
      relations: ['comments','tags'],
    });
  }

  async createPost(postDto: Partial<Posts>): Promise<Posts> {
    const newPost = this.postRepository.create(postDto);
    const savedPost = await this.postRepository.save(newPost);
    const hashtags = this.extractHashtags(savedPost.content);
    await this.processTags(savedPost, hashtags);
    return savedPost;
  }

  async updatePost(post_id: number, postDto: Partial<Posts>): Promise<Posts> {
    // Fetch the existing post
    const post = await this.getPost(post_id);
    if (!post) {
      throw new Error('Post not found');
    }

    // Extract hashtags from the current content
    const oldHashtags = this.extractHashtags(post.content);

    // Check if the content is being updated
    const isContentChanged = postDto.content && postDto.content !== post.content;

    // Update the post in the repository
    await this.postRepository.update(post_id, postDto);

    // Fetch the updated post with current tag relationships
    const updatedPost = await this.getPost(post_id);

    // Extract hashtags from the updated content if content changed
    const newHashtags = isContentChanged
      ? this.extractHashtags(updatedPost.content)
      : oldHashtags;

    let tagsToUnlink: string[] = [];
    let tagsToLink: string[] = [];

    if (postDto.tags && Array.isArray(postDto.tags)) {
      // User explicitly updated tags
      const existingTagNames = post.tags.map(tag => tag.name);
      const updatedTagNames = postDto.tags.map(tag => tag.name);

      // Find tags to unlink (tags that were in existing but not in updated)
      tagsToUnlink = existingTagNames.filter(
        tagName => !updatedTagNames.includes(tagName)
      );

      // Find tags to link (tags that are in updated but not in existing)
      tagsToLink = updatedTagNames.filter(
        tagName => !existingTagNames.includes(tagName)
      );

      // Update the post's tags
      if (tagsToUnlink.length > 0) {
        updatedPost.tags = updatedPost.tags.filter(
          tag => !tagsToUnlink.includes(tag.name)
        );
      }
    } else if (isContentChanged) {
      // Content changed but tags weren't explicitly updated
      const existingTagNames = post.tags.map(tag => tag.name);

      // Find hashtags that were removed from content
      tagsToUnlink = oldHashtags.filter(tag =>
        !newHashtags.includes(tag) && existingTagNames.includes(tag)
      );

      // Find new hashtags that aren't already linked
      tagsToLink = newHashtags.filter(tag =>
        !oldHashtags.includes(tag) && !existingTagNames.includes(tag)
      );

      // Keep existing tags that are still present in content
      if (tagsToUnlink.length > 0) {
        updatedPost.tags = updatedPost.tags.filter(
          tag => !tagsToUnlink.includes(tag.name)
        );
      }
    }

    // Process and link new tags while preserving existing relationships
    if (tagsToLink.length > 0) {
      // Create new tags if they don't exist and get their entities
      const newTagEntities = await Promise.all(
        tagsToLink.map(async (tagName) => {
          let tag = await this.tagRepository.findOne({ where: { name: tagName } });
          if (!tag) {
            tag = await this.tagRepository.save({ name: tagName });
          }
          return tag;
        })
      );

      // Combine existing tags with new tags
      updatedPost.tags = [...updatedPost.tags, ...newTagEntities];

      // Save the updated post with all tag relationships
      await this.postRepository.save(updatedPost);
    }

    return updatedPost;
  }
  async deletePost(post_id: number): Promise<void> {
    await this.postRepository.delete(post_id);
  }
}
