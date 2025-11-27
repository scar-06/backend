import { Injectable, Logger } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import { Appointment } from '../appointments/appointment.entity';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);

  private getClient() {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
      this.logger.warn('Google service account env vars are not set; skipping calendar sync');
      return null;
    }

    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    return google.calendar({ version: 'v3', auth: jwtClient });
  }

  async createEvent(appointment: Appointment): Promise<string | null> {
    const calendar = this.getClient();
    if (!calendar) return null;

    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) {
      this.logger.warn('GOOGLE_CALENDAR_ID not set; skipping calendar sync');
      return null;
    }

    const start = appointment.appointmentDateTime.toISOString();
    const endDate = new Date(appointment.appointmentDateTime.getTime() + 30 * 60 * 1000);
    const end = endDate.toISOString();

    const event: calendar_v3.Schema$Event = {
      summary: `Appointment with ${appointment.name}`,
      description: appointment.notes ?? undefined,
      start: { dateTime: start },
      end: { dateTime: end },
      // attendees: [{ email: appointment.email }],
    };

    try {
      const res = await calendar.events.insert({
        calendarId,
        requestBody: event,
      });
      return res.data.id ?? null;
    } catch (err) {
      this.logger.error('Failed to create Google Calendar event', err as any);
      return null;
    }
  }
}