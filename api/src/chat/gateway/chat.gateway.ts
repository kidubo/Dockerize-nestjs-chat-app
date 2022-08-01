/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { UserI } from 'src/user/entities/user.interface';
import { UserService } from 'src/user/service/user.service';

@WebSocketGateway({
  cors: { origin: ['https://hoppscotch.io', 'http://localhost:3000'] },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server;

  title: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );

      // validate the user with adding the jwt and checking it onHandle in nest Gateway
      const user: UserI = await this.userService.getOne(decodedToken.user.id);

      if (!user) {
        // disconnect
        return this.disconnect(socket);
      } else {
        this.title.push('Value', Math.random().toString());
        this.server.emit('message', this.title);
      }
    } catch {
      // disconnect
      return this.disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', 'new UnauthorizedError("Unauthorized")');
    socket.disconnect();
  }
}
