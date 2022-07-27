import { IsNotEmpty, IsString } from 'class-validator';
import { UserLoginDto } from './user-login.dto';

export class CreateUserDto extends UserLoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
