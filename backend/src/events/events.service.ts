import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<EventEntity> {
    const { name, location, start_time, end_time, max_capacity } = createEventDto;

    // Validate dates
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (startTime <= new Date()) {
      throw new BadRequestException('Start time must be in the future');
    }

    const event = await this.prisma.event.create({
      data: {
        name,
        location,
        startTime,
        endTime,
        maxCapacity: max_capacity,
        currentAttendees: 0,
      },
      include: {
        attendees: true,
      },
    });

    return new EventEntity(event);
  }

  async findAll(): Promise<EventEntity[]> {
    const events = await this.prisma.event.findMany({
      where: {
        startTime: {
          gt: new Date(),
        },
      },
      include: {
        attendees: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return events.map(event => new EventEntity(event));
  }

  async findOne(id: number): Promise<EventEntity> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        attendees: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return new EventEntity(event);
  }

  async updateCapacity(eventId: number): Promise<EventEntity> {
    const attendeeCount = await this.prisma.attendee.count({
      where: { eventId },
    });

    const event = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        currentAttendees: attendeeCount,
      },
      include: {
        attendees: true,
      },
    });

    return new EventEntity(event);
  }

  async hasCapacity(eventId: number): Promise<boolean> {
    const event = await this.findOne(eventId);
    return event.current_attendees < event.max_capacity;
  }
}