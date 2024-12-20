import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostDto,PostListDto } from './post.dto';
import { Post } from './post.entity';
import { Tags } from 'src/tags/tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Tags)
    private readonly tagRepository: Repository<Tags>,
  ) {}

  private extractHashtags(content: string): string[] {
    const regex = /#\w+/g;
    return content.match(regex) || [];
  }

  private async processTags(post: Post, hashtags: string[]): Promise<void> {
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
  async getAllPosts(categoryId?: number): Promise<PostListDto[]> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoin('post.category', 'category')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(comments.id)', 'commentCount')
          .from('comments', 'comments')
          .where('comments.post_id = post.id');
      }, 'commentCount');

    if (categoryId) {
      queryBuilder.where('category.id = :categoryId', { categoryId });
    }

    const rawPosts = await queryBuilder.getRawMany();

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
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.created_at',
        'post.updated_at',
        'user.username',
        'category',
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
    console.log('Received postDto:', postDto);
    const newPost = this.postRepository.create({
      ...postDto,
      user_id: userId,
    });
    return this.postRepository.save(newPost);
  }

    async updatePost(id: number, postDto: PostDto): Promise<Post> {
    // Fetch the existing post
      const post = await this.getPostById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    // Extract hashtags from the current content
    const oldHashtags = this.extractHashtags(post.content);

    // Check if the content is being updated
    const isContentChanged = postDto.content && postDto.content !== post.content;

    // Update the post in the repository
    await this.postRepository.update(id, postDto);

    // Fetch the updated post with current tag relationships
    const updatedPost = await this.getPostById(id);

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
