import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Observable, of, switchMap } from 'rxjs';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserI } from '../entities/user.interface';
import { UserService } from '../service/user.service';
import { UserHelperService } from '../service/user-helper-service/user-helper-service.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserLoginDto } from '../dtos/user-login.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Observable<UserI> {
    return this.userHelperService
      .createUserDtoToEntity(createUserDto)
      .pipe(switchMap((user: UserI) => this.userService.create(user)));
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Observable<Pagination<UserI>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({
      page,
      limit,
      route: `http://localhost:3000/user`,
    });
  }

  @Post('login')
  loginUser(@Body() loginUserDto: UserLoginDto): Observable<boolean> {
    return this.userHelperService
      .loginUserDtoToEntity(loginUserDto)
      .pipe(switchMap((user: UserI) => this.userService.login(user)));
  }
}
