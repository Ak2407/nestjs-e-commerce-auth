import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async create(user: CreateUserDto): Promise<User> {
    const isUser = await this.userModel
      .findOne({ username: user.username })
      .exec();
    if (isUser) {
      throw new BadRequestException('Username already exists');
    }

    return this.userModel.create(user);
  }
}
