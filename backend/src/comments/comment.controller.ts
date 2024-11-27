import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CommentDto } from './comment.entity';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getAllComments(@Res() res) {
    const comments = await this.commentService.getAllComments();
    return res.status(HttpStatus.OK).json(comments);
  }

  @Get(':id')
  async getComment(@Param('id') id: number, @Res() res) {
    const comment = await this.commentService.getComment(id);
    return res.status(HttpStatus.OK).json(comment);
  }

  @Post()
  async createComment(@Body() commentDto: CommentDto) {
    return await this.commentService.createComment(commentDto);
  }

  @Put(':id')
  async updateComment(
    @Param('id') id: number,
    @Body() commentDto: Omit<CommentDto, 'post_id' | 'comment_id'>,
    @Res() res,
  ) {
    const comment = await this.commentService.updateComment(id, commentDto);
    return res.status(HttpStatus.OK).json(comment);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: number, @Res() res) {
    await this.commentService.deleteComment(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
