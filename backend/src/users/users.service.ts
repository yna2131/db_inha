import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }

    async create(userData: { email: string }): Promise<User> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    async setPseudo(email: string, pseudo: string) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new Error("User not found");
        }
        user.pseudo = pseudo;
        await this.userRepository.save(user);
        return user;
    }
}
