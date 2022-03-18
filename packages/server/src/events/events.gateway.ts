import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { TransformBadRequestFilter } from 'src/transform-bad-request.filter';

@UsePipes(new ValidationPipe())
@UseFilters(TransformBadRequestFilter)
@WebSocketGateway()
export class EventsGateway
  implements
    OnGatewayInit<Server>,
    OnGatewayConnection<Socket>,
    OnGatewayDisconnect<Socket>
{
  users = new Map<string, Socket>();

  afterInit(
    server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    server.use((socket, next) => {
      const { username } = socket.handshake.auth;
      if (!username) return next(new Error('Username is required'));

      if (this.users.has(username))
        return next(new Error('Username is already taken'));

      this.users.set(username, socket);
      next();
    });
  }

  handleConnection(client: Socket) {
    console.log('Client connected', client.handshake.auth.username);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);

    this.users.delete(client.handshake.auth.username);
  }
}
