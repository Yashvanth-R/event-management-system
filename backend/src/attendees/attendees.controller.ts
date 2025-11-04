import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AttendeesService } from './attendees.service';
import { RegisterAttendeeDto } from './dto/register-attendee.dto';
import { AttendeeEntity } from './entities/attendee.entity';

@ApiTags('attendees')
@Controller('events/:eventId/attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Post()
  @ApiOperation({ summary: 'Register an attendee for an event' })
  @ApiParam({
    name: 'eventId',
    type: 'integer',
    description: 'Event ID',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Attendee registered successfully',
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
  async register(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() registerAttendeeDto: RegisterAttendeeDto,
  ) {
    try {
      const attendee = await this.attendeesService.register(
        eventId,
        registerAttendeeDto,
      );
      return {
        success: true,
        message: 'Attendee registered successfully',
        data: attendee,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error_code: error.status === 409 ? 'DUPLICATE_REGISTRATION' : 'REGISTRATION_FAILED',
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get attendees for an event (paginated)' })
  @ApiParam({
    name: 'eventId',
    type: 'integer',
    description: 'Event ID',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of event attendees',
    type: [AttendeeEntity],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found',
  })
  async findEventAttendees(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Query('page') pageParam?: string,
    @Query('limit') limitParam?: string,
  ) {
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 15;
    try {
      const result = await this.attendeesService.findEventAttendees(
        eventId,
        page,
        limit,
      );
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

  @Get('all')
  @ApiOperation({ summary: 'Get all attendees for an event (no pagination)' })
  @ApiParam({
    name: 'eventId',
    type: 'integer',
    description: 'Event ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all event attendees',
    type: [AttendeeEntity],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found',
  })
  async findAllEventAttendees(
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    try {
      const attendees = await this.attendeesService.findAllEventAttendees(eventId);
      return {
        success: true,
        message: 'All attendees retrieved successfully',
        data: attendees,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}