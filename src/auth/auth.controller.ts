import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<string> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() singUpDto: CreateUserDto): Promise<string> {
    return this.authService.signUp(singUpDto);
  }

  @Get()
  async authorizeToken(
    @Headers('authorization') authorization: string,
  ): Promise<any> {
    const token = authorization.split(' ')[1];
    return this.authService.validateToken(token);
  }
}
