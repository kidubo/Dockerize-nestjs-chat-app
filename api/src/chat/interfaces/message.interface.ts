import { UserI } from 'src/user/interfaces/user.interface';
import { RoomI } from './room.interface';

export interface MessageI {
  id?: number;
  text?: string;
  user?: UserI;
  room?: RoomI;
  createdAt?: Date;
  updatedAt?: Date;
}
