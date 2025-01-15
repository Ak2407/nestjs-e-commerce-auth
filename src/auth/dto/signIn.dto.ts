import { IsNotEmpty, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
