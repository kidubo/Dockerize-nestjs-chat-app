import { UserI } from 'src/user/entities/user.interface';

export class RoomI {
  id?: number;
  name?: string;
  description?: string;
  users?: UserI[];
  createdAt?: Date;
  updatedAt?: Date;
}
