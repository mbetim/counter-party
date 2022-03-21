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
  }

  leaveParty() {
    if (this.party) {
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
