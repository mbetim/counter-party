import { Module } from '@nestjs/common';
import { PartiesModule } from 'src/parties/parties.module';
import { UsersModule } from 'src/users/users.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [PartiesModule, UsersModule],
  providers: [EventsGateway],
})
export class EventsModule {}
