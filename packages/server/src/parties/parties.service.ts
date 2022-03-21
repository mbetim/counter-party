import { Injectable } from '@nestjs/common';
import { Party } from './party';

@Injectable()
export class PartiesService {
  private readonly parties = new Map<string, Party>();

  create(party: Party) {
    this.parties.set(party.name, party);
  }

  findOneByName(name: string): Party | null {
    return this.parties.get(name);
  }

  delete(party: Party) {
    this.parties.delete(party.name);
  }
}
