<<<<<<< HEAD
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

    async findById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
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

    async setPassword(email: string, password: string) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new Error("User not found");
        }
        user.password = password;
        await this.userRepository.save(user);
        return user;
    }
=======
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    const user = this.userRepository.create({ email, username, password });
    return this.userRepository.save(user);
  }

  async updateUsername(username: string, password: string) {
    const user = await this.userRepository.findOneBy({ password });
    if (!user) {
      throw new Error('User not found');
    }
    user.username = username;
    await this.userRepository.save(user);
    return user;
  }

  async updatePassword(username: string, password: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new Error('User not found');
    }
    user.password = password;
    await this.userRepository.save(user);
    return user;
  }
>>>>>>> 0964371bec2a6f7242760d41381f8d437bad0118
}
