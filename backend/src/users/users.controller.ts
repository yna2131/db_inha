import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './users.entity';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req, @Res() res) {
    console.log('req.user', req.user);
    if (!req.user) {
      throw new UnauthorizedException('Invalid token');
    }
    return res
      .status(HttpStatus.OK)
      .json(await this.usersService.findById(req.user.sub));
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User | string> {
    const user = await this.usersService.findById(id);
    if (!user) {
      return 'User not found';
    }
    return user;
  }

  @Get('/username/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<User | string> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return 'User not found';
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
