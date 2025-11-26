import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // Public endpoint to create an appointment
  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    const appointment = await this.appointmentsService.create(dto);
    return {
      id: appointment.id,
      name: appointment.name,
      email: appointment.email,
      appointmentDateTime: appointment.appointmentDateTime,
      notes: appointment.notes,
      googleEventId: appointment.googleEventId,
      createdAt: appointment.createdAt,
    };
  }

  // Admin-only endpoints
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    const items = await this.appointmentsService.findAll();
    return items.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      appointmentDateTime: a.appointmentDateTime,
      notes: a.notes,
      googleEventId: a.googleEventId,
      createdAt: a.createdAt,
    }));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    const a = await this.appointmentsService.findOne(id);
    if (!a) return null;
    return {
      id: a.id,
      name: a.name,
      email: a.email,
      appointmentDateTime: a.appointmentDateTime,
      notes: a.notes,
      googleEventId: a.googleEventId,
      createdAt: a.createdAt,
    };
  }
}
