import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';
import { GroupsEntity } from '../joined-room/joined-room.entity';
import { MessageEntity } from '../message/message.entity';

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // @ManyToMany(() => UserEntity, (user) => user.rooms)
  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => GroupsEntity, (members) => members.room)
  member: GroupsEntity[];

  @OneToMany(() => MessageEntity, (messages) => messages.room)
  messages: MessageEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
