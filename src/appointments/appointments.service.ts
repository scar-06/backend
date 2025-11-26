import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const appointmentDateTime = new Date(dto.appointmentDateTime);
    const appointment = this.appointmentsRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      appointmentDateTime,
      notes: dto.notes,
    });

    const saved = await this.appointmentsRepository.save(appointment);

    const googleEventId = await this.googleCalendarService.createEvent(saved);
    if (googleEventId) {
      saved.googleEventId = googleEventId;
      await this.appointmentsRepository.save(saved);
    }

    return saved;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({ order: { appointmentDateTime: 'DESC' } });
  }

  async findOne(id: string): Promise<Appointment | null> {
    return this.appointmentsRepository.findOne({ where: { id } });
  }
}
