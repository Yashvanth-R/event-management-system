import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { AttendeeEntity } from './entities/attendee.entity';

@ApiTags('global-attendees')
@Controller('attendees')
export class GlobalAttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attendee and assign to event' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Attendee created successfully',
    type: AttendeeEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Event at capacity or validation error',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already registered for this event',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found',
  })
  async create(@Body() createAttendeeDto: CreateAttendeeDto) {
    try {
      const attendee = await this.attendeesService.createAttendee(createAttendeeDto);
      return {
        success: true,
        message: 'Attendee created and assigned to event successfully',
        data: attendee,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error_code: error.status === 409 ? 'DUPLICATE_REGISTRATION' : 'CREATION_FAILED',
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendees across all events (paginated)' })
  @ApiQuery({
    name: 'page',
    type: 'integer',
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    type: 'integer',
    required: false,
    description: 'Items per page (default: 15)',
  })
  @ApiQuery({
    name: 'eventId',
    type: 'integer',
    required: false,
    description: 'Filter by event ID (optional)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all attendees',
    type: [AttendeeEntity],
  })
  async findAll(
    @Query('page') pageParam?: string,
    @Query('limit') limitParam?: string,
    @Query('eventId') eventIdParam?: string,
  ) {
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 15;
    const eventId = eventIdParam ? parseInt(eventIdParam, 10) : undefined;

    try {
      const result = await this.attendeesService.findAllAttendees(page, limit, eventId);
      return {
        success: true,
        message: 'Attendees retrieved successfully',
        ...result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific attendee' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Attendee ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attendee details',
    type: AttendeeEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Attendee not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const attendee = await this.attendeesService.findAttendeeById(id);
      return {
        success: true,
        message: 'Attendee retrieved successfully',
        data: attendee,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an attendee from an event' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Attendee ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attendee removed successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Attendee not found',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.attendeesService.removeAttendee(id);
      return {
        success: true,
        message: 'Attendee removed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}