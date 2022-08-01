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
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
  @WebSocketServer()
  server;

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   this.server.emit('message', 'test');
  //   return 'Hello world!';
  // }

  handleConnection(socket: Socket) {
    try {
      const decodedToken = this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      // const user: UserI = this.userService.getOne(decodedToken.user.id);
    } catch {
      console.log('Invalid token');
    }
    this.server.emit('message', 'test');
    console.log('Client connected');
  }

  handleDisconnect() {
    console.log('Client disconnected');
  }
}
