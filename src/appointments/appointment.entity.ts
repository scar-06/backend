import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'appointments' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'timestamptz' })
  appointmentDateTime: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ type: 'text', nullable: true })
  googleEventId?: string | null;

  @CreateDateColumn()
  createdAt: Date;
}