import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomEntity } from '../../chat/entities/room.entity';
import { ConnectedUserEntity } from '../../chat/entities/connected-user.entity';

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

  @OneToMany(() => ConnectedUserEntity, (connection) => connection.user)
  connections: ConnectedUserEntity[];

  @ManyToMany(() => RoomEntity, (room) => room.users)
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
