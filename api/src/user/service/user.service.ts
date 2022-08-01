/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserI } from '../entities/user.interface';
import { from, Observable, of } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/service/auth.service';
// import * as bcrypt from 'bcryptjs';

const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(newUser: UserI): Observable<UserI> {
    return this.mailExists(newUser.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.hashPassword(newUser.password).pipe(
            switchMap((hashedPassword: string) => {
              newUser.password = hashedPassword;
              return from(this.userRepository.save(newUser)).pipe(
                switchMap((user: UserI) => this.findOne(user.id)),
              );
            }),
          );
        } else {
          throw new HttpException(
            'User already exists',
            HttpStatus.BAD_REQUEST,
          );
        }
      }),
    );
  }

  login(user: UserI): Observable<string> {
    return this.findByEmail(user.email).pipe(
      switchMap((foundUser: UserI) => {
        if (foundUser) {
          return this.validatePassword(user.password, foundUser.password).pipe(
            switchMap((matches: boolean) => {
              if (matches) {
                return this.findOne(foundUser.id).pipe(
                  switchMap((user: UserI) => {
                    const token = this.authService.generateJWT(user);
                    return token;
                  }),
                );
              } else {
                throw new HttpException(
                  'Invalid password',
                  HttpStatus.BAD_REQUEST,
                );
              }
            }),
          );
        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      }),
    );
  }

  findAll(options: IPaginationOptions): Observable<Pagination<UserI>> {
    return from(paginate<UserEntity>(this.userRepository, options));
  }

  private validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Observable<any | boolean> {
    return of<any | boolean>(bcrypt.compare(password, storedPasswordHash));
  }

  //   also return the password hash
  private findByEmail(email: string): Observable<UserI> {
    return from(
      this.userRepository.findOne({
        where: { email: email },
        select: ['id', 'username', 'email', 'password'],
      }),
    );
  }

  private hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 10));
  }

  public getOne(id: number): Promise<UserI> {
    return this.userRepository.findOneOrFail({ where: { id: id } });
  }

  private findOne(id: number): Observable<UserI> {
    return from(this.userRepository.findOne({ where: { id: id } }));
  }

  private mailExists(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { email: email } })).pipe(
      map((user: UserI) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      }),
    );
  }
}
