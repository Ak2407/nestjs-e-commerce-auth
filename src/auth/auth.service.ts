import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private JwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ username }).exec();

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
      const { _id, name } = user;
      return {
        accessToken: token,
        userId: _id,
        name,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async signUp(user: CreateUserDto): Promise<any> {
    try {
      const isUser = await this.userModel.findOne({ username: user.username });

      if (isUser) {
        throw new BadRequestException('Username already exists');
      }

      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;

      const newUser = await this.userModel.create(user);

      const payload = { userId: newUser.username };
      const token = this.JwtService.sign(payload);
      return {
        accessToken: token,
        userId: newUser._id,
        name: newUser.name,
      };
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
