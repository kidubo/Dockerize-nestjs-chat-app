import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserI } from '../interfaces/user.interface';
import { UserService } from '../service/user.service';
import { UserHelperService } from '../service/user-helper-service/user-helper-service.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserLoginDto } from '../dtos/user-login.dto';
import { LoginResponseI } from '../interfaces/login-res.interface';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserI> {
    const userEntity = await this.userHelperService.createUserDtoToEntity(
      createUserDto,
    );
    return this.userService.create(userEntity);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Pagination<UserI>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({
      page,
      limit,
      route: `http://localhost:3000/user`,
    });
  }

  @Get('/username')
  async findAllByUsername(@Query('name') name: string): Promise<UserI> {
    return this.userService.findAllByUsername(name);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: UserLoginDto): Promise<LoginResponseI> {
    const userEntity = await this.userHelperService.loginUserDtoToEntity(
      loginUserDto,
    );
    const jwt: string = await this.userService.login(userEntity);
    return {
      access_token: jwt,
      token_type: 'JWT',
      expires_in: 600000,
    };
  }
}
