import { WsException } from '@nestjs/websockets';
import { nanoid } from 'nanoid';
import { User } from '../users/user';

interface PartyConstructorProps {
  host: User;
  incrementOptions: Party['incrementOptions'];
}

export class Party {
  name: string;
  socketRoomName: string;
  host: User;
  connectedUsers = new Map<string, User>();
  incrementOptions: number[] = [];

  constructor(props: PartyConstructorProps) {
    this.name = nanoid(6);
    this.socketRoomName = `party:${this.name}`;

    this.host = props.host;
    this.connectedUsers.set(this.host.username, this.host);

    this.incrementOptions = props.incrementOptions;
  }

  addUser(user: User): void {
    if (this.host.username === user.username)
      throw new WsException('You cannot join your own party');

    if (this.connectedUsers.has(user.username))
      throw new WsException('You are already in this party');

    this.connectedUsers.set(user.username, user);
    user.joinParty(this);
  }

  removeUser(user: User) {
    this.connectedUsers.delete(user.username);
    user.leaveParty();
  }

  private mapToArray() {
    return Array.from(this.connectedUsers.values());
  }

  toJson() {
    return {
      ...this,
      host: this.host.toJson(),
      connectedUsers: this.mapToArray().map((user) => user.toJson()),
    };
  }
}
