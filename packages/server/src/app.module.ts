import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { PartiesModule } from './parties/parties.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [EventsModule, PartiesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
