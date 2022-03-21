import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user';

@Injectable()
export class UsersService {
  private readonly users = new Map<string, User>();

  create(user: User): void {
    this.users.set(user.username, user);
  }

  findOneBySocketId(id: string): User {
    return Array.from(this.users.values()).find(
      (user) => user.socket.id === id,
    );
  }

  findOneByUsername(username: string): User {
    return this.users.get(username);
  }

  delete(user: User): void {
    this.users.delete(user.username);
  }
}
