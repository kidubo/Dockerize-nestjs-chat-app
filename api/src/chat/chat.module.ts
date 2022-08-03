import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat.gateway';
import { RoomService } from './service/room-service/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { ConnectedUserEntity } from './entities/connected-user/connected-user.entity';
import { MessageEntity } from './entities/message/message.entity';
import { GroupsRoomService } from './service/groups-room/groups-room.service';
import { MessageService } from './service/message/message.service';
import { GroupsEntity } from './entities/joined-room/joined-room.entity';
import { RoomEntity } from './entities/room/room.entity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([
      ConnectedUserEntity,
      MessageEntity,
      GroupsEntity,
      RoomEntity,
    ]),
  ],
  providers: [
    ChatGateway,
    RoomService,
    ConnectedUserService,
    GroupsRoomService,
    MessageService,
  ],
})
export class ChatModule {}
