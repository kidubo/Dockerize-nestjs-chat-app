import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageI } from 'src/chat/interfaces/message.interface';
import { Repository } from 'typeorm';
import { MessageEntity } from '../../entities/message/message.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { RoomI } from 'src/chat/interfaces/room.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(message: MessageI): Promise<MessageI> {
    return await this.messageRepository.save(
      this.messageRepository.create(message),
    );
  }

  async findMessageForRoom(
    room: RoomI,
    option: IPaginationOptions,
  ): Promise<Pagination<MessageI>> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.room', 'room')
      .where('room.id = :roomId', { roomId: room.id })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.createdAt', 'DESC');

    return paginate(query, option);
  }
}
