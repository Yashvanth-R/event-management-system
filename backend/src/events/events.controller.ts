import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from './entities/event.entity';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Event created successfully',
    type: EventEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  async create(@Body() createEventDto: CreateEventDto) {
    try {
      const event = await this.eventsService.create(createEventDto);
      return {
        success: true,
        message: 'Event created successfully',
        data: event,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create event',
        error: error.message,
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all upcoming events' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of upcoming events',
    type: [EventEntity],
  })
  async findAll() {
    try {
      const events = await this.eventsService.findAll();
      return {
        success: true,
        message: 'Events retrieved successfully',
        data: events,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve events',
        error: error.message,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific event' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Event ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event details',
    type: EventEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const event = await this.eventsService.findOne(id);
      return {
        success: true,
        message: 'Event retrieved successfully',
        data: event,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}