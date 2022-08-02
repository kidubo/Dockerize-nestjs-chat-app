import { UserI } from 'src/user/interfaces/user.interface';

export interface ConnectedUserI {
  id?: number;
  socketId: string;
  user: UserI;
}
