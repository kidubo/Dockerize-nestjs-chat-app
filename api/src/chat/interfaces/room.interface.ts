import { UserI } from 'src/user/interfaces/user.interface';

export class RoomI {
  id?: number;
  name?: string;
  description?: string;
  users?: UserI[];
  createdAt?: Date;
  updatedAt?: Date;
}
