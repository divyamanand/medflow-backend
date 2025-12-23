import { Injectable, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserType } from '../../entities/user.entity';
import { Staff } from '../../entities/staff.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BootstrapService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Staff) private readonly staffRepo: Repository<Staff>,
  ) {}

  async createAdmin(payload: { email: string; password: string; firstName?: string; lastName?: string; phone?: string }, secretHeader?: string) {
    const adminCount = await this.userRepo.count({ where: { role: UserRole.Admin } });
    const requiredSecret = process.env.BOOTSTRAP_SECRET || '';
    if (adminCount > 0) {
      if (!requiredSecret || secretHeader !== requiredSecret) {
        throw new ConflictException('An admin already exists or invalid bootstrap secret');
      }
    }
    const { email, password, firstName, lastName, phone } = payload || ({} as any);
    if (!email || !password) throw new BadRequestException('email and password are required');
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      passwordHash,
      role: UserRole.Admin,
      type: UserType.Staff,
      firstName: firstName ?? null,
      lastName: lastName ?? null,
      phone: phone ?? null,
    } as Partial<User>);
    const saved = await this.userRepo.save(user);
    const staff = await this.staffRepo.save(this.staffRepo.create({ user: { id: saved.id } as any }));
    return {
      id: saved.id,
      email: saved.email,
      role: saved.role,
      staffId: staff.id,
      firstName: saved.firstName ?? null,
      lastName: saved.lastName ?? null,
      phone: saved.phone ?? null,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    } as any;
  }
}
