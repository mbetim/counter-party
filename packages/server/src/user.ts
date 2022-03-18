import { Socket } from 'socket.io';
import { Party } from './parties/party';

export class User {
  username: string;
  socket: Socket;
  party?: Party;

  constructor(socket: Socket) {
    this.socket = socket;
    this.username = socket.handshake.auth.username;
  }

  public joinParty(party: Party) {
    this.party = party;
  }

  public toString() {
    return this.username;
  }

  public toJson() {
    return { username: this.username };
  }
}
