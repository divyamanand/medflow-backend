import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { StaffSpecialty } from './staff-specialty.entity';
import { Timings } from './timings.entity';
import { Leave } from './leave.entity';
import { User } from './user.entity';

@Entity({ name: 'staff' })
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => StaffSpecialty, (ss) => ss.staff)
  staffSpecialties!: StaffSpecialty[];

  @OneToMany(() => Timings, (t) => t.staff)
  timings!: Timings[];

  @OneToMany(() => Leave, (l) => l.staff)
  leaves!: Leave[];

  @OneToOne(() => User, (u: User) => u.staff, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'fk_staff_user' })
  user?: User | null;
}
