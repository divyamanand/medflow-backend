import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from '../../entities/specialty.entity';

@Injectable()
export class SpecialtyService {
  constructor(@InjectRepository(Specialty) private repo: Repository<Specialty>) {}

  async create(data: { code: string; name: string; description?: string }) {
    const { code, name, description } = data;
    
    if (!code || !name) {
      throw new Error('Code and name are required');
    }

    const existing = await this.repo.findOne({ where: { code } });
    if (existing) {
      throw new Error(`Specialty with code '${code}' already exists`);
    }

    const specialty = this.repo.create({
      code,
      name,
      description: description || null,
    });

    return this.repo.save(specialty);
  }

  async findAll(filter?: { search?: string }) {
    const qb = this.repo.createQueryBuilder('s');
    
    if (filter?.search) {
      qb.where('s.name ILIKE :search OR s.code ILIKE :search OR s.description ILIKE :search', {
        search: `%${filter.search}%`,
      });
    }

    qb.orderBy('s.name', 'ASC');
    return qb.getMany();
  }

  async searchByName(keyword: string) {
    const qb = this.repo.createQueryBuilder('s');
    
    if (keyword) {
      qb.where('s.name ILIKE :keyword OR s.code ILIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    qb.select(['s.id', 's.name'])
      .orderBy('s.name', 'ASC');
    
    return qb.getMany();
  }

  async findOne(id: string) {
    const specialty = await this.repo.findOne({ where: { id } });
    if (!specialty) {
      throw new NotFoundException(`Specialty with id '${id}' not found`);
    }
    return specialty;
  }

  async findByCode(code: string) {
    const specialty = await this.repo.findOne({ where: { code } });
    if (!specialty) {
      throw new NotFoundException(`Specialty with code '${code}' not found`);
    }
    return specialty;
  }

  async update(id: string, data: Partial<Specialty>) {
    const specialty = await this.findOne(id);

    if (data.code && data.code !== specialty.code) {
      const existing = await this.repo.findOne({ where: { code: data.code } });
      if (existing) {
        throw new Error(`Specialty with code '${data.code}' already exists`);
      }
    }

    await this.repo.update({ id }, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    const specialty = await this.findOne(id);
  
    const assignmentCount = await this.repo.query(
      'SELECT COUNT(*) as count FROM staff_specialty WHERE "specialtyId" = $1',
      [id],
    );
    
    const count = parseInt(assignmentCount[0]?.count || '0', 10);
    if (count > 0) {
      throw new Error(`Cannot delete specialty. It is assigned to ${count} staff member(s)`);
    }

    await this.repo.delete({ id });
    return { id, removed: true };
  }

  async getStaffBySpecialty(specialtyId: string) {
    const specialty = await this.findOne(specialtyId);
    
    const staffList = await this.repo.query(
      `SELECT s.id, s.notes, ss."primary", u.id as "userId", u."firstName", u."lastName", u.email, u.phone, u.role
       FROM staff_specialty ss
       JOIN staff s ON s.id = ss."staffId"
       LEFT JOIN "user" u ON u.id = s."userId"
       WHERE ss."specialtyId" = $1 AND s."deletedAt" IS NULL
       ORDER BY ss."primary" DESC, u."lastName" ASC, u."firstName" ASC`,
      [specialtyId],
    );

    return {
      specialty,
      staff: staffList.map((s: any) => ({
        id: s.id,
        userId: s.userId,
        name: [s.firstName, s.lastName].filter(Boolean).join(' ') || null,
        email: s.email,
        phone: s.phone,
        role: s.role,
        notes: s.notes,
        primary: s.primary,
      })),
    };
  }
}
