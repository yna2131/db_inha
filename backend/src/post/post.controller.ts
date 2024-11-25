import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Posts } from './post.entity';
import { CreatePostDto } from './create_post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPosts(@Res() res) {
    const posts = await this.postService.getAllPosts();
    return res.status(HttpStatus.OK).json(posts);
  }

  @Get(':post_id')
  async getPost(@Param('post_id') post_id: number, @Res() res) {
    const post = await this.postService.getPost(post_id);
    if (!post) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Post not found' });
    }
    return res.status(HttpStatus.OK).json(post);
  }

  @Post()
  async createPost(@Body() postDto: CreatePostDto, @Res() res) {
    const post = await this.postService.createPost(postDto);
    return res.status(HttpStatus.CREATED).json(post);
  }

  @Put(':post_id')
  async updatePost(
    @Param('post_id') post_id: number,
    @Body() postDto: CreatePostDto,
    @Res() res,
  ) {
    const post = await this.postService.updatePost(post_id, postDto);
    return res.status(HttpStatus.OK).json(post);
  }

  @Delete(':post_id')
  async deletePost(@Param('post_id') post_id: number, @Res() res) {
    await this.postService.deletePost(post_id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
