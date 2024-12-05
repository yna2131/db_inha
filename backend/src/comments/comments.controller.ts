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
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentDto } from './comments.entity';
import { CommentsService } from './comments.service';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  async getAllComments(@Res() res) {
    const comments = await this.commentService.getAllComments();
    return res.status(HttpStatus.OK).json(comments);
  }

  @Get(':id')
  async getCommentById(@Param('id') id: number, @Res() res) {
    const comment = await this.commentService.getCommentById(id);
    return res.status(HttpStatus.OK).json(comment);
  }

  @Post()
  async createComment(
    @Request() req,
    @Body() commentDto: CommentDto,
    @Res() res,
  ) {
    const comment = await this.commentService.createComment(
      commentDto,
      req.user.sub,
    );
    return res.status(HttpStatus.CREATED).json(comment);
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
  async deleteComment(@Request() req, @Param('id') id: number, @Res() res) {
    await this.commentService.deleteComment(id, req.user.sub);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
