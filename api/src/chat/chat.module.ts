import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat.gateway';
import { RoomService } from './service/room-service/room.service';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { ConnectedUserEntity } from './entities/connected-user.entity';
import { Repository } from 'typeorm';
import { ConnectedUserI } from './interfaces/connected-user.interface';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([RoomEntity, ConnectedUserEntity]),
  ],
  providers: [ChatGateway, RoomService, ConnectedUserService],
})
export class ChatModule {}
