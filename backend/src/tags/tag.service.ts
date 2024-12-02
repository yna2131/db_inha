import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/post/post.entity';
import { Repository } from 'typeorm';
import { TagDto, Tags } from './tag.entity';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tags)
        private readonly tagRepository: Repository<Tags>,
        @InjectRepository(Posts)
        private readonly postRepository: Repository<Posts>,
    ) { }

    async getAllTags(): Promise<Tags[]> {
        return this.tagRepository.find();
    }

    async getTag(id: number): Promise<Tags> {
        return this.tagRepository.findOne({
            where: { id },
            relations: ['tags'],
        });
    }

    async createTag(tagDto: TagDto): Promise<Tags> {
        const { post_id, tag_id, ...otherFields } = tagDto;
        const newTag = this.tagRepository.create(otherFields);
        const post = await this.postRepository.findOne({ where: { post_id } });
        console.log(post);
        if (!post) {
            throw new HttpException(
                `Post with id ${post_id} does not exist.`,
                HttpStatus.NOT_FOUND,
            );
        }
        newTag.post = post;
        return this.tagRepository.save(newTag);
    }

    async updateTag(
        id: number,
        tagDto: Pick<TagDto, 'name'>,
    ): Promise<Tags> {
        await this.tagRepository.update(id, tagDto);
        return this.getTag(id);
    }

    async deleteTag(id: number): Promise<void> {
        await this.tagRepository.delete(id);
    }
}
