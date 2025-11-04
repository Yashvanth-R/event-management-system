import { Module } from '@nestjs/common';
import { AttendeesController } from './attendees.controller';
import { GlobalAttendeesController } from './global-attendees.controller';
import { AttendeesService } from './attendees.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [AttendeesController, GlobalAttendeesController],
  providers: [AttendeesService],
})
export class AttendeesModule {}