import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(
      authDto.email,
      authDto.username,
      authDto.password,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() authDto: Omit<AuthDto, 'email'>) {
    return this.authService.signIn(authDto.username, authDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
