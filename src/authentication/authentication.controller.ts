import { Body, Controller, Post, Get, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { User as UserEntity } from '../common/decorators/params/user.decorator';
import { User } from '@prisma/client';
import { Auth } from 'src/common/decorators/routes/auth.decorator';
import { Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(private auth: AuthenticationService) {}

  @Post('/signup')
  async signup(
    @Body() { firstName, lastName, email, password }: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    const user = await this.auth.signup(firstName, lastName, email, password);
    response.cookie('userId', user.id, { signed: true });
    return user;
  }

  @Post('/login')
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    const user = await this.auth.login(email, password);
    response.cookie('userId', user.id, { signed: true });
    return user;
  }

  @Get('/get_user_from_token')
  @Auth()
  getUserFromToken(@UserEntity() user: User): User {
    return user;
  }
}
