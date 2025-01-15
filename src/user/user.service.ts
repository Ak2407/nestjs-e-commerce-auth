import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(user: CreateUserDto): Promise<User> {
    const isUser = await this.userModel
      .findOne({ username: user.username })
      .exec();
    if (isUser) {
      throw new BadRequestException('Username already exists');
    }

    try {
      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;
      return this.userModel.create(user);
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user');
    }
    // return this.userModel.create(user);
  }
}
