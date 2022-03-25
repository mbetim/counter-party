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
import { User } from 'src/users/user';
import { TransformBadRequestFilter } from 'src/transform-bad-request.filter';
import { Party } from 'src/parties/party';
import { PartiesService } from 'src/parties/parties.service';
import { UsersService } from 'src/users/users.service';

@UsePipes(new ValidationPipe())
@UseFilters(TransformBadRequestFilter)
@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'] } })
export class EventsGateway
  implements
    OnGatewayInit<Server>,
    OnGatewayConnection<Socket>,
    OnGatewayDisconnect<Socket>
{
  @WebSocketServer()
  server: Server;

  constructor(
    private usersService: UsersService,
    private partiesService: PartiesService,
  ) {}

  afterInit(
    server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    server.use((client, next) => {
      const { username } = client.handshake.auth;
      if (!username) return next(new WsException('Username is required'));

      if (this.usersService.findOneByUsername(username))
        return next(new WsException('Username is already taken'));

      this.usersService.create(new User(client));
      next();
    });
  }

  handleConnection(client: Socket) {
    console.log('User connected', client.handshake.auth.username);
  }

  handleDisconnect(client: Socket) {
    const user = this.usersService.findOneBySocketId(client.id);

    if (user.party) {
      const party = user.party;
      party.removeUser(user);

      client.to(party.socketRoomName).emit('party:user:left', user.toJson());
      client.to(party.socketRoomName).emit('party:update', party.toJson());
    }

    this.usersService.delete(user);
    console.log('User disconnected: ', user.username);
  }

  @SubscribeMessage('party:create')
  createParty(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreatePartyDto,
  ) {
    const host = this.usersService.findOneBySocketId(client.id);
    let party: Party;

    do {
      party = new Party({
        host,
        incrementOptions: data.incrementOptions,
      });
    } while (this.partiesService.findOneByName(party.name));

    host.joinParty(party);
    this.partiesService.create(party);

    client.join(party.socketRoomName);

    return party.toJson();
  }

  @SubscribeMessage('party:join')
  joinParty(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') partyName?: string,
  ) {
    if (!partyName) throw new WsException('Party name is required');

    const user = this.usersService.findOneBySocketId(client.id);
    const party = this.partiesService.findOneByName(partyName);

    if (!party) throw new WsException('Party does not exist');

    party.addUser(user);

    client.join(party.socketRoomName);
    client.to(party.socketRoomName).emit('party:user:joined', user.toJson());
    client.to(party.socketRoomName).emit('party:update', party.toJson());

    return party.toJson();
  }

  @SubscribeMessage('party:update-counter')
  userIncrement(
    @ConnectedSocket() client: Socket,
    @MessageBody('points') points: number,
  ) {
    const user = this.usersService.findOneBySocketId(client.id);

    if (!user.party) throw new WsException('You are not in a party');
    if (!user.party.incrementOptions.includes(points))
      throw new WsException('Invalid points');

    user.counter += points ? Number(points) : 0;

    this.server
      .to(user.party.socketRoomName)
      .emit('party:update', user.party.toJson());
  }
}
