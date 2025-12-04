import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from '../../entities/prescription.entity';
import { PrescriptionItem } from '../../entities/prescription-item.entity';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription) private presRepo: Repository<Prescription>,
    @InjectRepository(PrescriptionItem) private itemRepo: Repository<PrescriptionItem>,
  ) {}

  // ============ PRESCRIPTION CRUD ============

  async findAll(filter?: any) {
    const qb = this.presRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'pUser')
      .leftJoinAndSelect('p.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'dUser')
      .leftJoinAndSelect('p.items', 'items')
      .where('1=1');

    if (filter?.patientId) qb.andWhere('p."patientId" = :pid', { pid: filter.patientId });
    if (filter?.doctorId) qb.andWhere('p."doctorId" = :did', { did: filter.doctorId });
    if (filter?.from) qb.andWhere('p."createdAt" >= :from', { from: filter.from });
    if (filter?.to) qb.andWhere('p."createdAt" <= :to', { to: filter.to });

    qb.orderBy('p."createdAt"', 'DESC');
    return qb.getMany();
  }

  async create(data: {
    patientId: string;
    doctorId?: string;
    nextReview?: string;
    diagnosis?: string;
    notes?: string;
    items?: Array<{
      name: string;
      dosage: string;
      duration: string;
      quantity: number;
      dayDivide?: string;
      method?: string;
    }>;
  }) {
    const items = data.items || [];
    delete (data as any).items;

    // Create prescription
    const prescription = this.presRepo.create({
      patient: { id: data.patientId } as any,
      doctor: data.doctorId ? { id: data.doctorId } as any : null,
      nextReview: data.nextReview || null,
      diagnosis: data.diagnosis || null,
      notes: data.notes || null,
      updatedAt: new Date(),
    });

    const savedPrescription = await this.presRepo.save(prescription);

    // Create items if provided
    if (items.length > 0) {
      const now = new Date();
      const itemEntities = items.map(item =>
        this.itemRepo.create({
          prescription: { id: savedPrescription.id } as any,
          name: item.name,
          dosage: item.dosage,
          duration: item.duration,
          quantity: item.quantity,
          dayDivide: item.dayDivide || null,
          method: item.method || null,
          createdAt: now,
          updatedAt: now,
        })
      );
      await this.itemRepo.save(itemEntities);
    }

    return this.findOne(savedPrescription.id);
  }

  async findOne(id: string) {
    const prescription = await this.presRepo.findOne({
      where: { id },
      relations: ['patient', 'patient.user', 'doctor', 'doctor.user', 'items'],
    });
    return prescription;
  }

  async update(id: string, data: Partial<{
    nextReview: string;
    diagnosis: string;
    notes: string;
    items: Array<{
      name: string;
      dosage: string;
      duration: string;
      quantity: number;
      dayDivide?: string;
      method?: string;
    }>;
  }>) {
    const prescription = await this.presRepo.findOne({ where: { id } });
    if (!prescription) {
      throw new NotFoundException(`Prescription with id '${id}' not found`);
    }

    const items = data.items;
    delete (data as any).items;

    // Update prescription fields
    const updateData: any = { ...data, updatedAt: new Date() };
    await this.presRepo.update({ id }, updateData);

    // If items provided, replace all items
    if (items !== undefined) {
      // Delete existing items
      await this.itemRepo.delete({ prescription: { id } as any });

      // Add new items
      if (items.length > 0) {
        const now = new Date();
        const itemEntities = items.map(item =>
          this.itemRepo.create({
            prescription: { id } as any,
            name: item.name,
            dosage: item.dosage,
            duration: item.duration,
            quantity: item.quantity,
            dayDivide: item.dayDivide || null,
            method: item.method || null,
            createdAt: now,
            updatedAt: now,
          })
        );
        await this.itemRepo.save(itemEntities);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const prescription = await this.presRepo.findOne({ where: { id } });
    if (!prescription) {
      throw new NotFoundException(`Prescription with id '${id}' not found`);
    }
    await this.presRepo.delete({ id });
    return { id, removed: true };
  }

  // ============ PRESCRIPTION ITEM CRUD ============

  async addItem(prescriptionId: string, data: {
    name: string;
    dosage: string;
    duration: string;
    quantity: number;
    dayDivide?: string;
    method?: string;
  }) {
    const prescription = await this.presRepo.findOne({ where: { id: prescriptionId } });
    if (!prescription) {
      throw new NotFoundException(`Prescription with id '${prescriptionId}' not found`);
    }

    const now = new Date();
    const item = this.itemRepo.create({
      prescription: { id: prescriptionId } as any,
      name: data.name,
      dosage: data.dosage,
      duration: data.duration,
      quantity: data.quantity,
      dayDivide: data.dayDivide || null,
      method: data.method || null,
      createdAt: now,
      updatedAt: now,
    });

    return this.itemRepo.save(item);
  }

  async updateItem(itemId: string, data: Partial<{
    name: string;
    dosage: string;
    duration: string;
    quantity: number;
    dayDivide: string;
    method: string;
  }>) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException(`Prescription item with id '${itemId}' not found`);
    }

    const updateData: any = { ...data, updatedAt: new Date() };
    await this.itemRepo.update({ id: itemId }, updateData);

    return this.itemRepo.findOne({ where: { id: itemId } });
  }

  async removeItem(itemId: string) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException(`Prescription item with id '${itemId}' not found`);
    }
    await this.itemRepo.delete({ id: itemId });
    return { id: itemId, removed: true };
  }
}
