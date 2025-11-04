import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateAttendeeDto {
  @ApiProperty({
    description: 'Attendee name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Attendee email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Event ID to assign the attendee to',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  eventId: number;
}