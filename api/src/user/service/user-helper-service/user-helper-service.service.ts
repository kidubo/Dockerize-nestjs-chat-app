import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserLoginDto } from 'src/user/dtos/user-login.dto';
import { UserI } from 'src/user/interfaces/user.interface';

@Injectable()
export class UserHelperService {
  async createUserDtoToEntity(createUserDto: CreateUserDto): Promise<UserI> {
    return {
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    };
  }

  async loginUserDtoToEntity(loginUserDto: UserLoginDto): Promise<UserI> {
    return {
      email: loginUserDto.email,
      password: loginUserDto.password,
    };
  }
}
