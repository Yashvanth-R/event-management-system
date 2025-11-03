import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({
    description: 'Event name',
    example: 'Tech Conference 2025',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Event location',
    example: 'Convention Center',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'Event start time',
    example: '2025-12-01T10:00:00Z',
  })
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  start_time: string;

  @ApiProperty({
    description: 'Event end time',
    example: '2025-12-01T18:00:00Z',
  })
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  end_time: string;

  @ApiProperty({
    description: 'Maximum capacity',
    example: 100,
  })
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  max_capacity: number;
}