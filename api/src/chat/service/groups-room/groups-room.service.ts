import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsEntity } from 'src/chat/entities/joined-room/joined-room.entity';
import { RoomI } from 'src/chat/interfaces/room.interface';
import { UserI } from 'src/user/interfaces/user.interface';
import { Repository } from 'typeorm';
import { JoinedRoomI } from '../../interfaces/joined-room.interface';

@Injectable()
export class GroupsRoomService {
  constructor(
    @InjectRepository(GroupsEntity)
    private readonly groupsRepository: Repository<GroupsEntity>,
  ) {}

  async create(group: JoinedRoomI): Promise<JoinedRoomI> {
    return await this.groupsRepository.save(group);
  }

  async findByUser(user: UserI): Promise<JoinedRoomI[]> {
    return await this.groupsRepository.findBy({ user });
  }

  async findByRoom(room: RoomI): Promise<JoinedRoomI[]> {
    return this.groupsRepository.find({ where: { room } });
  }

  async deleteBySocketId(socketId: string) {
    return await this.groupsRepository.delete({ socketId });
  }

  async deleteAll() {
    return await this.groupsRepository.createQueryBuilder().delete().execute();
  }
}
