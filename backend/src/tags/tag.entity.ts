import { Post } from 'src/posts/post.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tags {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 2000, default: 'No content written' })
    name: string;

    @ManyToMany(() => Post, (post) => post.tags)
    post: Post[];
}

export class TagDto {
    @Column({ nullable: true })
    post_id: number;

    @Column({ nullable: true })
    tag_id: number;

    @Column({ length: 2000 })
    name: string;
}
