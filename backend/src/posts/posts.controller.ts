import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './posts.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Get()
  async getAllPosts(@Res() res) {
    const posts = await this.postService.getAllPosts();
    return res.status(HttpStatus.OK).json(posts);
  }

  @Get(':post_id')
  async getPost(@Param('post_id') post_id: number, @Res() res) {
    const post = await this.postService.getPost(post_id);
    return res.status(HttpStatus.OK).json(post);
  }

  @Post()
  async createPost(@Request() req, @Body() postDto: PostDto, @Res() res) {
    const post = await this.postService.createPost(postDto, req.user.sub);
    return res.status(HttpStatus.CREATED).json(post);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() postDto: PostDto,
    @Res() res,
  ) {
    const post = await this.postService.updatePost(id, postDto);
    return res.status(HttpStatus.OK).json(post);
  }

  @Delete(':id')
  async deletePost(@Request() req, @Param('id') id: number, @Res() res) {
    await this.postService.deletePost(id, req.user.sub);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
