import { Socket } from 'socket.io';
import { Party } from '../parties/party';

export class User {
  username: string;
  socket: Socket;
  party?: Party;
  counter = 0;

  constructor(socket: Socket) {
    this.socket = socket;
    this.username = socket.handshake.auth.username;
  }

  disconnect() {
    if (this.party) {
      this.party.removeUser(this);
    }
  }

  joinParty(party: Party) {
    this.party = party;
    this.counter = 0;

    this.socket.join(this.party.socketRoomName);
    this.socket
      .to(this.party.socketRoomName)
      .emit('party:update', this.party.toJson());
  }

  leaveParty() {
    if (this.party) {
      // TODO: Check if this is really required
      this.socket
        .to(this.party.socketRoomName)
        .emit('party:update', this.party.toJson());

      this.socket.leave(this.party.socketRoomName);
      this.party = undefined;
    }
  }

  get isAHost() {
    return this.party && this.party.host === this;
  }

  toJson() {
    return { username: this.username, points: this.counter };
  }
}
