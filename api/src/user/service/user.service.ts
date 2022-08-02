/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserI } from '../interfaces/user.interface';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/service/auth.service';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async create(newUser: UserI): Promise<UserI> {
    try {
      const exists: boolean = await this.mailExists(newUser.email);
      if (!exists) {
        const passwordHash = await this.hashPassword(newUser.password);
        newUser.password = passwordHash;
        const user = await this.userRepository.save(
          this.userRepository.create(newUser),
        );
        return this.findOne(user.id);
      } else {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
    } catch {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
  }

  async login(user: UserI): Promise<string> {
    try {
      const foundUser: UserI = await this.findByEmail(
        user.email.toLocaleLowerCase(),
      );
      if (foundUser) {
        const matches = await this.validatePassword(
          user.password,
          foundUser.password,
        );
        if (matches) {
          const payload: UserI = await this.findOne(foundUser.id);
          const token: string = await this.authService.generateJWT(payload);
          return token;
        } else {
          throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      }
    } catch {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<UserI>> {
    return paginate<UserEntity>(this.userRepository, options);
  }

  async findAllByUsername(name: string): Promise<any | UserI> {
    return this.userRepository.find({
      where: {
        username: Like(`%${name.toLocaleLowerCase()}%`),
      },
    });
  }

  private async validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<any | boolean> {
    return await bcrypt.compare(password, storedPasswordHash);
  }

  private async findByEmail(email: string): Promise<UserI> {
    return await this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'username', 'email', 'password'],
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async getOne(id: number): Promise<UserI> {
    return await this.userRepository.findOneOrFail({ where: { id: id } });
  }

  private async findOne(id: number): Promise<UserI> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}
