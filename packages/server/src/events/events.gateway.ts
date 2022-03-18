import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { CreatePartyDto } from 'src/parties/dto/create-party.dto';
import { User } from 'src/user';
import { TransformBadRequestFilter } from 'src/transform-bad-request.filter';
import { Party } from 'src/parties/party';

@UsePipes(new ValidationPipe())
@UseFilters(TransformBadRequestFilter)
@WebSocketGateway()
export class EventsGateway
  implements
    OnGatewayInit<Server>,
    OnGatewayConnection<Socket>,
    OnGatewayDisconnect<Socket>
{
  users = new Map<string, User>();
  parties = new Map<string, Party>();

  afterInit(
    server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    server.use((socket, next) => {
      const { username } = socket.handshake.auth;
      if (!username) return next(new WsException('Username is required'));

      if (this.users.has(username))
        return next(new WsException('Username is already taken'));

      this.users.set(socket.id, new User(socket));
      next();
    });
  }

  handleConnection(client: Socket) {
    console.log('User connected', client.handshake.auth.username);
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected: ', client.id);

    this.users.delete(client.handshake.auth.username);
  }

  @SubscribeMessage('party:create')
  createParty(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreatePartyDto,
  ) {
    const host = this.users.get(client.id);
    let party: Party;

    do {
      party = new Party({
        host,
        incrementOptions: data.incrementOptions,
      });
    } while (this.parties.has(party.name));

    host.joinParty(party);
    this.parties.set(party.name, party);

    return party.toJson();
  }
}
