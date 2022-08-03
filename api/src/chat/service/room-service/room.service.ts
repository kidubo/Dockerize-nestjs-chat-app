import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomI } from 'src/chat/interfaces/room.interface';
import { UserI } from 'src/user/interfaces/user.interface';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/chat/entities/room/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async create(room: RoomI, creator: UserI): Promise<RoomI> {
    const newRoom = await this.addCreatorToRoom(room, creator);
    return this.roomRepository.save(newRoom);
  }

  async getRoom(roomId: number): Promise<RoomI> {
    return await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users'],
    });
  }

  async getRoomsForUser(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<RoomI>> {
    const query = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .orderBy('room.updatedAt', 'DESC');

    return paginate(query, options);
  }

  async addCreatorToRoom(room: RoomI, creator: UserI): Promise<RoomI> {
    room.users.push(creator);
    return room;
  }
}
