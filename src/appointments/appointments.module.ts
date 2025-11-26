import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './appointment.entity';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [AppointmentsService, GoogleCalendarService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
