import { UserEntity } from 'src/user/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import { RoomEntity } from '../room/room.entity';

@Entity()
export class GroupsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => UserEntity, (user) => user.groups)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => RoomEntity, (room) => room.member)
  @JoinColumn()
  room: RoomEntity;
}
