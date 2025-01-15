import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private JwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(username);

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
      return token;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
