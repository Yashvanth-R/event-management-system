import { ApiProperty } from '@nestjs/swagger';
import { Attendee as PrismaAttendee, Event } from '@prisma/client';

export class AttendeeEntity implements PrismaAttendee {
  @ApiProperty()
  id: number;

  @ApiProperty()
  eventId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  registeredAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // API format fields
  @ApiProperty()
  registered_at?: string;

  @ApiProperty()
  formatted_registered_at?: string;

  event?: Event;

  constructor(partial: Partial<AttendeeEntity>) {
    Object.assign(this, partial);
    
    // Map database fields to API format
    this.registered_at = this.registeredAt?.toISOString();
    
    this.formatted_registered_at = this.registeredAt?.toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  }
}