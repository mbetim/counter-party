import { User } from "./user";

export interface Party {
  name: string;
  host: User;
  incrementOptions: number[];
  connectedUsers: User[];
}
