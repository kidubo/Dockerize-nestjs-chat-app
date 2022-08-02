import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/chat/entities/connected-user.entity';
import { ConnectedUserI } from 'src/chat/interfaces/connected-user.interface';
import { UserI } from 'src/user/interfaces/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create(connectedUser: ConnectedUserI): Promise<ConnectedUserI> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findByUser(user: UserI): Promise<ConnectedUserI[]> {
    return this.connectedUserRepository.findBy({ user });
  }

  async deleteBySocketId(socketId: string): Promise<any> {
    this.connectedUserRepository.delete({ socketId });
  }
}
