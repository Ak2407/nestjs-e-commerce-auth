import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private JwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findByUsername(username);

      if (!user) {
        throw new UnauthorizedException('Invalid Login Credentials');
      }
      const passwordMatch = await bcrypt.compare(pass, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid Login Credentials');
      }
      const { password, ...result } = user;

      const payload = { userId: result.username };
      const token = this.JwtService.sign(payload);
      return {
        accessToken: token,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async signUp(user: CreateUserDto): Promise<any> {
    try {
      const isUser = await this.usersService.findByUsername(user.username);

      if (isUser) {
        throw new BadRequestException('Username already exists');
      }

      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;

      return this.usersService.create(user);
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user');
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.JwtService.verify(token);
      return payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
