import { nanoid } from 'nanoid';
import { User } from '../user';

interface PartyConstructorProps {
  host: User;
  incrementOptions: Party['incrementOptions'];
}

export class Party {
  name: string;
  host: User;
  connectedUsers: User[] = [];
  incrementOptions: number[] = [];

  constructor(props: PartyConstructorProps) {
    this.name = nanoid(6);
    this.host = props.host;
    this.incrementOptions = props.incrementOptions;
  }

  toJson() {
    return { ...this, host: this.host.toJson() };
  }
}
