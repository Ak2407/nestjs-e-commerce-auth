import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Finding all Users
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Creating a new User
  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.create(user);
  }
}
