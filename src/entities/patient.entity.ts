import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Staff } from './staff.entity';
import { User } from './user.entity';

@Entity({ name: 'patient' })
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Staff, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'primaryPhysicianId' })
  primaryPhysician!: Staff | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  // Link to base user for authentication/authorization
  @OneToOne(() => User, (u: User) => u.patient, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'fk_patient_user' })
  user?: User | null;
}
