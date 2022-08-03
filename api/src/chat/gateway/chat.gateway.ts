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
import { UserI } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/service/user.service';
import { ConnectedUserI } from '../interfaces/connected-user.interface';
import { PageI } from '../interfaces/page.interface';
import { RoomI } from '../interfaces/room.interface';
import { ConnectedUserService } from '../service/connected-user/connected-user.service';
import { RoomService } from '../service/room-service/room.service';

@WebSocketGateway({
  cors: { origin: ['https://hoppscotch.io', 'http://localhost:3000'] },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
    private connectedUserService: ConnectedUserService,
  ) {}

  async onModuleInit() {
    console.log('ChatGateway initialized');
    await this.connectedUserService.deleteAll();
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      // validate the user with adding the jwt and checking it onHandle in nest Gateway
      const user: UserI = await this.userService.getOne(decodedToken.user.id);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.roomService.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        // Save connection to DB
        await this.connectedUserService.create({ socketId: socket.id, user });
        // only emit rooms to the specific connected user / client
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket): Promise<any> {
    // remove connection from DB
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', 'new UnauthorizedError("Unauthorized")');
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI): Promise<any> {
    const createdRoom: RoomI = await this.roomService.create(
      room,
      socket.data.user,
    );
    for (const user of createdRoom.users) {
      const connections: ConnectedUserI[] =
        await this.connectedUserService.findByUser(user);
      const rooms = await this.roomService.getRoomsForUser(user.id, {
        page: 1,
        limit: 10,
      });
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }

  @SubscribeMessage('paginateRoom')
  async onPaginateRoom(socket: Socket, page: PageI) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    page.page = page.page + 1;
    const rooms = await this.roomService.getRoomsForUser(
      socket.data.user.id,
      page,
    );
    return this.server.to(socket.id).emit('rooms', rooms);
  }
}
