import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { UserEntity } from './entities/user.entity';
import { UserHelperService } from './service/user-helper-service/user-helper-service.service';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UserHelperService],
  exports: [UserService],
})
export class UserModule {}
