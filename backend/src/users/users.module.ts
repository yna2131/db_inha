import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
=======
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';
>>>>>>> 0964371bec2a6f7242760d41381f8d437bad0118

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
<<<<<<< HEAD
})

=======
  exports: [UsersService],
})
>>>>>>> 0964371bec2a6f7242760d41381f8d437bad0118
export class UsersModule {}
