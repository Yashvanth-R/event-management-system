import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterAttendeeDto {
  @ApiProperty({
    description: 'Attendee name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Attendee email',
    example: 'john@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}