import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserLoginDto } from 'src/user/dtos/user-login.dto';
import { UserI } from 'src/user/entities/user.interface';

@Injectable()
export class UserHelperService {
  createUserDtoToEntity(createUserDto: CreateUserDto): Observable<UserI> {
    return of({
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    });
  }

  loginUserDtoToEntity(loginUserDto: UserLoginDto): Observable<UserI> {
    return of({
      email: loginUserDto.email,
      password: loginUserDto.password,
    });
  }
}
