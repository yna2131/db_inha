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
}
