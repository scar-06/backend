import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEmail()
  email: string;

  // Accept raw datetime-local string from the frontend and parse on the server
  @IsString()
  appointmentDateTime: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
