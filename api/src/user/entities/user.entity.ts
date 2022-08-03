import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomEntity } from '../../chat/entities/room/room.entity';
import { ConnectedUserEntity } from '../../chat/entities/connected-user/connected-user.entity';
import { GroupsEntity } from '../../chat/entities/joined-room/joined-room.entity';
import { MessageEntity } from 'src/chat/entities/message/message.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => MessageEntity, (messages) => messages.user)
  messages: MessageEntity[];

  @OneToMany(() => GroupsEntity, (groups) => groups.user)
  groups: GroupsEntity[];

  @OneToMany(() => ConnectedUserEntity, (connection) => connection.user)
  connections: ConnectedUserEntity[];

  // @ManyToMany(() => RoomEntity, (room) => room.users)
  @ManyToMany(() => RoomEntity)
  rooms: RoomEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLocaleLowerCase();
  }
}
