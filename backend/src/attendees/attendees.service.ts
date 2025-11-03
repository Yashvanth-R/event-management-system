import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { RegisterAttendeeDto } from './dto/register-attendee.dto';
import { AttendeeEntity } from './entities/attendee.entity';

@Injectable()
export class AttendeesService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

  async register(
    eventId: number,
    registerAttendeeDto: RegisterAttendeeDto,
  ): Promise<AttendeeEntity> {
    // Check if event exists
    const event = await this.eventsService.findOne(eventId);
    
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if event has capacity
    const hasCapacity = await this.eventsService.hasCapacity(eventId);
    if (!hasCapacity) {
      throw new BadRequestException(
        `Event '${event.name}' has reached maximum capacity of ${event.max_capacity} attendees`,
      );
    }

    // Check for duplicate registration
    const existingAttendee = await this.prisma.attendee.findUnique({
      where: {
        eventId_email: {
          eventId,
          email: registerAttendeeDto.email,
        },
      },
    });

    if (existingAttendee) {
      throw new ConflictException(
        'This email is already registered for this event',
      );
    }

    // Register attendee
    const attendee = await this.prisma.attendee.create({
      data: {
        eventId,
        name: registerAttendeeDto.name,
        email: registerAttendeeDto.email,
        registeredAt: new Date(),
      },
      include: {
        event: true,
      },
    });

    // Update event capacity
    await this.eventsService.updateCapacity(eventId);

    return new AttendeeEntity(attendee);
  }

  async findEventAttendees(
    eventId: number,
    page: number = 1,
    limit: number = 15,
  ) {
    // Check if event exists
    await this.eventsService.findOne(eventId);

    const skip = (page - 1) * limit;

    const [attendees, total] = await Promise.all([
      this.prisma.attendee.findMany({
        where: { eventId },
        include: { event: true },
        orderBy: { registeredAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.attendee.count({
        where: { eventId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: attendees.map(attendee => new AttendeeEntity(attendee)),
      pagination: {
        current_page: page,
        last_page: totalPages,
        per_page: limit,
        total,
        from: skip + 1,
        to: Math.min(skip + limit, total),
      },
    };
  }

  async findAllEventAttendees(eventId: number): Promise<AttendeeEntity[]> {
    // Check if event exists
    await this.eventsService.findOne(eventId);

    const attendees = await this.prisma.attendee.findMany({
      where: { eventId },
      include: { event: true },
      orderBy: { registeredAt: 'desc' },
    });

    return attendees.map(attendee => new AttendeeEntity(attendee));
  }
}