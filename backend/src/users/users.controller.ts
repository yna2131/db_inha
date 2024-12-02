<<<<<<< HEAD
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}


    @Post('/login')
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;

        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found.' };
        }

        if (user.password === password) {
            return { success: true, message: 'Login successful.', userId: user.id };
        } else {
            return { success: false, message: 'Invalid password.' };
        }
    }

    @Get(':user_id')
    async getUserById(@Param('user_id') user_id: number): Promise<User | string> {
    const user = await this.usersService.findById(user_id);
    if (!user) {
        return 'User not found';
    }
    return user;
}

    @Post()
    async createOrGetUser(@Body() body: { email: string }) {
        const { email } = body;
        console.log(`Received email: ${email}`);
        let user = await this.usersService.findByEmail(email);
        if (user) {
            console.log('User exists, returning user data');
            return { exists: true, user };
        } else {
            console.log('User does not exist, creating user');
            user = await this.usersService.create({ email });
            return { exists: false, message: 'Register', user };
        }
    }

    @Get(':email')
    async getUserByEmail(@Param('email') email: string): Promise<User | string> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
        return 'User not find';
        }
        return user;
    }

    @Post('create')
    async createUser(@Body() body: { email: string }): Promise<User | string> {
        const { email } = body;
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
        return 'User already exist !';
        }
        const newUser = await this.usersService.create({ email });
        return newUser;
    }

    @Post('/set-pseudo')
    async setPseudo(@Body() body: { email: string; pseudo: string }) {
        const user = await this.usersService.setPseudo(body.email, body.pseudo);
        return { success: true, userId: user.id, user };
    }

    @Post('/set-password')
    async setPassword(@Body() body: { email: string; password: string }) {
        const user = await this.usersService.setPassword(body.email, body.password);
        return { success: true, userId: user.id, user };
    }

=======
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User | string> {
    const user = await this.usersService.findById(id);
    if (!user) {
      return 'User not find';
    }
    return user;
  }

  @Get('/username/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<User | string> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return 'User not find';
    }
    return user;
  }

  @Post('/change-username')
  async updateUsername(@Body() body: { email: string; pseudo: string }) {
    const user = await this.usersService.updateUsername(
      body.email,
      body.pseudo,
    );
    return { success: true, userId: user.id, user };
  }

  @Post('/change-password')
  async updatePassword(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.updatePassword(
      body.email,
      body.password,
    );
    return { success: true, userId: user.id, user };
  }
>>>>>>> 0964371bec2a6f7242760d41381f8d437bad0118
}
