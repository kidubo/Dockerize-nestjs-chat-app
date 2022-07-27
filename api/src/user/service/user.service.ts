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
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(newUser: UserI): Observable<UserI> {
    return this.mailExists(newUser.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.hashPassword(newUser.password).pipe(
            switchMap((passwordHash: string) => {
              // overwrite the user password with the hash, to store the hash in the database
              newUser.password === passwordHash;
              return from(this.userRepository.save(newUser)).pipe(
                switchMap((user: UserI) => {
                  console.log(user);
                  return this.findOne(user.id);
                }),
              );
            }),
          );
        } else {
          throw new HttpException('Email already exists', HttpStatus.CONFLICT);
        }
      }),
    );
  }

  //   refactor this to use JWT
  login(user: UserI): Observable<boolean> {
    return this.findByEmail(user.email).pipe(
      switchMap((foundUser: UserI) => {
        console.log(foundUser);
        if (foundUser) {
          return this.validatePassword(user.password, foundUser.password).pipe(
            switchMap((isValid: boolean) => {
              if (isValid) {
                // return of(true);
                return this.findOne(foundUser.id).pipe(mapTo(true));
              } else {
                throw new HttpException(
                  'Invalid password',
                  HttpStatus.UNAUTHORIZED,
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
  ): Observable<any> {
    return from(bcrypt.compare(password, storedPasswordHash));
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
    return from<string>(bcrypt.hash(password, 12));
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
