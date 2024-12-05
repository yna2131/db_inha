import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string; user: User }> {
    const user = await this.usersService.findByUsername(username);

    if (user?.password !== pass) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = { sub: user.id, username: user.username };
    delete user.password;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  async signUp(email: string, username: string, password: string) {
    // const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create(email, username, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    delete user.password;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }
}
