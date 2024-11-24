import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    category_id: number;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;
}
