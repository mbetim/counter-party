import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
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
  @WebSocketServer()
  server: Server;

  users = new Map<string, User>();
  parties = new Map<string, Party>();

  afterInit(
    server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    this.server = server;
    server.use((client, next) => {
      const { username } = client.handshake.auth;
      if (!username) return next(new WsException('Username is required'));

      if (this.users.has(username))
        return next(new WsException('Username is already taken'));

      this.users.set(client.id, new User(client));
      next();
    });
  }

  handleConnection(client: Socket) {
    console.log('User connected', client.handshake.auth.username);
  }

  handleDisconnect(client: Socket) {
    const user = this.users.get(client.id);

    // TODO: Think if this is the best way to handle the situation
    if (user.party && user.isAHost) {
      client.to(user.party.socketRoomName).emit('party:dispose');

      this.parties.delete(user.party.name);
      user.party.dispose();
    } else {
      user.disconnect();
    }

    this.users.delete(client.id);

    console.log('User disconnected: ', user.username);
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

  @SubscribeMessage('party:join')
  joinParty(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') partyName?: string,
  ) {
    if (!partyName) throw new WsException('Party name is required');

    const user = this.users.get(client.id);
    const party = this.parties.get(partyName);

    if (!party) throw new WsException('Party does not exist');

    party.addUser(user);
    return party.toJson();
  }

  @SubscribeMessage('party:update-counter')
  userIncrement(
    @ConnectedSocket() client: Socket,
    @MessageBody('points') points: number,
  ) {
    const user = this.users.get(client.id);

    if (!user.party) throw new WsException('You are not in a party');
    if (!user.party.incrementOptions.includes(points))
      throw new WsException('Invalid points');

    user.counter += points ? Number(points) : 0;

    this.server
      .to(user.party.socketRoomName)
      .emit('party:update', user.party.toJson());
  }
}
