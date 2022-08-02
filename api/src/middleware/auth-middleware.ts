/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  HttpException,
  HttpStatus,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction, request } from 'express';
import { AuthService } from 'src/auth/service/auth.service';
import { UserI } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/service/user.service';

export interface RequestModel extends Request {
  user: UserI;
}

@Injectable()
export class authMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodeToken = await this.authService.verifyJwt(tokenArray[1]);

      // make sure that the user is not deleted, or that props or rights changed compared to the time when the jwt was issued

      const user: UserI = await this.userService.getOne(decodeToken.user.id);
      if (user) {
        // add the user to our req object, so that we can access it later when we need it
        // if it would be here, we would like overwrite

        req.user = user;
        next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
