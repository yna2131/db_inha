import { Posts } from 'src/post/post.entity';
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

    @ManyToMany(() => Posts, (post) => post.tags)
    post: Posts[];
}

export class TagDto {
    @Column({ nullable: true })
    post_id: number;

    @Column({ nullable: true })
    tag_id: number;

    @Column({ length: 2000 })
    name: string;
}
