import { ApiProperty } from '@nestjs/swagger';
import { Event as PrismaEvent, Attendee } from '@prisma/client';

export class EventEntity implements PrismaEvent {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  maxCapacity: number;

  @ApiProperty()
  currentAttendees: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Computed properties
  @ApiProperty()
  start_time?: string;

  @ApiProperty()
  end_time?: string;

  @ApiProperty()
  max_capacity?: number;

  @ApiProperty()
  current_attendees?: number;

  @ApiProperty()
  formatted_start_time?: string;

  @ApiProperty()
  formatted_end_time?: string;

  @ApiProperty()
  remaining_capacity?: number;

  @ApiProperty()
  has_capacity?: boolean;

  @ApiProperty()
  is_upcoming?: boolean;

  attendees?: Attendee[];

  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);
    
    // Map database fields to API format
    this.start_time = this.startTime?.toISOString();
    this.end_time = this.endTime?.toISOString();
    this.max_capacity = this.maxCapacity;
    this.current_attendees = this.currentAttendees;
    
    // Computed properties
    this.formatted_start_time = this.startTime?.toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
    
    this.formatted_end_time = this.endTime?.toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
    
    this.remaining_capacity = this.maxCapacity - this.currentAttendees;
    this.has_capacity = this.currentAttendees < this.maxCapacity;
    this.is_upcoming = this.startTime > new Date();
  }
}