import { Posts } from 'src/post/post.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tags {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 2000, default: 'No content written' })
    content: string;

    // Relation to Posts
    @ManyToOne(() => Posts, (post) => post.comments, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'post_id' }) // This will add the foreign key column 'post_id'
    post: Posts;
}

export class TagDto {
    @Column({ nullable: true })
    post_id: number;

    @Column({ nullable: true })
    tag_id: number;

    @Column({ length: 2000 })
    content: string;
}
