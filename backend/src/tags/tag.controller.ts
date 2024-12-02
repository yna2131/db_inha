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
import { TagDto } from './tag.entity';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Get()
  async getAllComments(@Res() res) {
    const tags = await this.tagService.getAllTags();
    return res.status(HttpStatus.OK).json(tags);
  }

  @Get(':id')
  async getComment(@Param('id') id: number, @Res() res) {
    const comment = await this.tagService.getTag(id);
    return res.status(HttpStatus.OK).json(comment);
  }
  @Post()
  async createComment(@Body() tagDto: TagDto) {
    return await this.tagService.createTag(tagDto);
  }

  @Put(':id')
  async updateComment(
    @Param('id') id: number,
    @Body() tagtDto: Omit<TagDto, 'tag_id'>,
    @Res() res,
  ) {
    const comment = await this.tagService.updateTag(id, tagtDto);
    return res.status(HttpStatus.OK).json(comment);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: number, @Res() res) {
    await this.tagService.deleteTag(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
