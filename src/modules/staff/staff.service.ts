import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, IsNull } from 'typeorm';
import { Staff } from '../../entities/staff.entity';
import { Timings } from '../../entities/timings.entity';
import { Leave } from '../../entities/leave.entity';
import { User, UserRole, UserType } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { StaffRequirementFulfillment } from '../../entities/staff-requirement-fulfillment.entity';
import { StaffRequirement } from '../../entities/staff-requirement.entity';
import { RequirementStatus } from '../../entities/item-requirement.entity';

function withinNow(startTime: string, endTime: string, nowMinutes: number): boolean {
  const [sh, sm] = startTime.split(':').map(v => parseInt(v || '0',10));
  const [eh, em] = endTime.split(':').map(v => parseInt(v || '0',10));
  const startM = sh * 60 + sm;
  const endM = eh * 60 + em;
  return nowMinutes >= startM && nowMinutes < endM;
}

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff) private repo: Repository<Staff>,
    @InjectRepository(Timings) private timingsRepo: Repository<Timings>,
    @InjectRepository(Leave) private leaveRepo: Repository<Leave>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(StaffRequirementFulfillment) private staffFulfillRepo: Repository<StaffRequirementFulfillment>,
    @InjectRepository(StaffRequirement) private staffReqRepo: Repository<StaffRequirement>,
  ) {}

  async create(data: any) {
    const { email, password, role, firstName, lastName, dateOfBirth, gender, phone, notes } = data || {};
    if (!role) throw new Error('staff role is required');
    if (email && password) {
      const exists = await this.userRepo.findOne({ where: { email } });
      if (exists) throw new Error('Email already in use');
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await this.userRepo.save(this.userRepo.create({
        email,
        passwordHash,
        role,
        type: UserType.Staff,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        dateOfBirth: dateOfBirth ?? null,
        gender: gender ?? null,
        phone: phone ?? null,
      } as Partial<User>));
      const staff = this.repo.create({ notes: notes ?? null, user: { id: user.id } as any });
      return this.repo.save(staff);
    }
    const staff = this.repo.create({ notes: notes ?? null });
    return this.repo.save(staff);
  }
  async findAll(filter?: any) {
    let rows = await this.repo.find({ relations: ['user'] });
    if (!filter) return rows;
    if (filter.role) rows = rows.filter(r => r.user?.role === filter.role);
    if (filter.specialtyId) {
      const specStaffIds = await this.repo.query(
        'SELECT staffId FROM staff_specialty WHERE specialtyId = $1',
        [filter.specialtyId],
      );
      const allowedIds = new Set(specStaffIds.map((r: any) => r.staffid || r.staffId));
      rows = rows.filter(r => allowedIds.has(r.id));
    }

    const today = new Date();
    const todayStr = today.toISOString().slice(0,10);
    if (filter.onLeave || filter.isAvailable) {
      const staffIds = rows.map(r => r.id);
      if (staffIds.length) {
        const leaves = await this.leaveRepo.createQueryBuilder('l')
          .where('l.staffId IN (:...ids)', { ids: staffIds })
          .andWhere('l.status = :st', { st: 'approved' })
          .andWhere(':today BETWEEN l.startDate AND l.endDate', { today: todayStr })
          .getMany();
                const leaveSet = new Set(leaves.map(l => l.staff?.id).filter((v): v is string => !!v));
        const timings = await this.timingsRepo.createQueryBuilder('t')
          .where('t.staffId IN (:...ids)', { ids: staffIds })
          .andWhere('t.isAvailable = true')
          .getMany();
        const weekday = today.getDay();
        const nowMinutes = today.getHours() * 60 + today.getMinutes();
        const availSet = new Set(
              timings
               .filter(t => t.weekday === weekday && withinNow(t.startTime, t.endTime, nowMinutes))
               .map(t => t.staff?.id)
               .filter((v): v is string => !!v),
        );
        if (filter.onLeave) rows = rows.filter(r => leaveSet.has(r.id));
        if (filter.isAvailable) rows = rows.filter(r => availSet.has(r.id) && !leaveSet.has(r.id));
      }
    }
    return rows;
  }
  findOne(id: string) { return this.repo.findOne({ where: { id }, relations: ['user'] }); }
  async update(id: string, data: any) {
    const staffUpdates: Partial<Staff> = {};
    if (typeof data.notes !== 'undefined') staffUpdates.notes = data.notes;
    if (Object.keys(staffUpdates).length) await this.repo.update({ id }, staffUpdates);
    if (data.firstName || data.lastName || data.phone || data.gender || data.dateOfBirth) {
      const staff = await this.repo.findOne({ where: { id }, relations: ['user'] });
      if (staff?.user?.id) {
        await this.userRepo.update({ id: staff.user.id }, {
          firstName: data.firstName ?? staff.user.firstName ?? null,
          lastName: data.lastName ?? staff.user.lastName ?? null,
          phone: data.phone ?? staff.user.phone ?? null,
          gender: data.gender ?? staff.user.gender ?? null,
          dateOfBirth: data.dateOfBirth ?? staff.user.dateOfBirth ?? null,
        } as Partial<User>);
      }
    }
    return this.findOne(id);
  }

  private async loadSpecialtiesMap(staffIds: string[]) {
    if (!staffIds.length) return new Map<string, Array<{ id: string; name: string; primary: boolean }>>();
    const raw = await this.repo.query(
      `SELECT ss."staffId" as staffId, sp.id as specId, sp.name as specName, ss."primary" as primary
       FROM staff_specialty ss
       JOIN specialty sp ON sp.id = ss."specialtyId"
       WHERE ss."staffId" = ANY($1::uuid[])`,
      [staffIds],
    );
    const map = new Map<string, Array<{ id: string; name: string; primary: boolean }>>();
    for (const r of raw) {
      const sid = r.staffid || r.staffId;
      if (!map.has(sid)) map.set(sid, []);
      map.get(sid)!.push({ id: r.specid || r.specId, name: r.specname || r.specName, primary: !!r.primary });
    }
    return map;
  }

  async findAllDetailed(filter?: any) {
    const rows = await this.findAll(filter);
    const ids = rows.map((r) => r.id);
    const specMap = await this.loadSpecialtiesMap(ids);
    return rows.map((s) => {
      const firstName = s.user?.firstName || '';
      const lastName = s.user?.lastName || '';
      const name = [firstName, lastName].join(' ').trim() || null;
      return {
        id: s.id,
        userId: s.user?.id || null,
        name,
        role: s.user?.role || null,
        phone: s.user?.phone || null,
        email: s.user?.email || null,
        notes: s.notes || null,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        specialties: (specMap.get(s.id) || []).sort((a,b)=> (b.primary?1:0) - (a.primary?1:0)),
      };
    });
  }

  async findOneDetailed(id: string) {
    const s = await this.findOne(id);
    if (!s) return null;
    const specMap = await this.loadSpecialtiesMap([s.id]);
    const firstName = s.user?.firstName || '';
    const lastName = s.user?.lastName || '';
    const name = [firstName, lastName].join(' ').trim() || null;
    return {
      id: s.id,
      userId: s.user?.id || null,
      name,
      role: s.user?.role || null,
      phone: s.user?.phone || null,
      email: s.user?.email || null,
      notes: s.notes || null,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      specialties: (specMap.get(s.id) || []).sort((a,b)=> (b.primary?1:0) - (a.primary?1:0)),
    };
  }

  getTimings(staffId: string) { return this.timingsRepo.find({ where: { staff: { id: staffId } as any } }); }

  async upsertTimings(staffId: string, entries: Partial<Timings>[]) {
    const created: Timings[] = [];
    const updated: Timings[] = [];

    const newEntries = entries.filter((e: any) => !e?.id);
    if (newEntries.length) {
      const toCreate = newEntries.map((e) => this.timingsRepo.create({ ...e, staff: { id: staffId } as any }));
      const saved = await this.timingsRepo.save(toCreate);
      created.push(...saved);
    }

    const updates = entries.filter((e: any) => !!e?.id);
    for (const u of updates as any[]) {
      const { id, ...rest } = u || {};
      if (!id) continue;
      await this.timingsRepo.createQueryBuilder()
        .update(Timings)
        .set({ ...rest })
        .where('id = :id AND staffId = :sid', { id, sid: staffId })
        .execute();
      const row = await this.getTimingById(staffId, id);
      if (row) updated.push(row as Timings);
    }

    return [...created, ...updated];
  }

  addLeave(staffId: string, leave: Partial<Leave>) {
    return this.leaveRepo.save(this.leaveRepo.create({ ...leave, staff: { id: staffId } as any }));
  }

  // Timings CRUD
  createTiming(staffId: string, timing: Partial<Timings>) {
    console.log(timing)
    return this.timingsRepo.save(this.timingsRepo.create({ ...timing, staff: { id: staffId } as any }));
  }

  getTimingById(staffId: string, timingId: string) {
    return this.timingsRepo.findOne({ where: { id: timingId, staff: { id: staffId } as any } as any });
  }

  async updateTiming(staffId: string, timingId: string, data: Partial<Timings>) {
    console.log(timingId, data, staffId)
    await this.timingsRepo.createQueryBuilder()
      .update(Timings)
      .set(data)
      .where('id = :id AND staffId = :sid', { id: timingId, sid: staffId })
      .execute();
    return this.getTimingById(staffId, timingId);
  }

  async deleteTiming(staffId: string, timingId: string) {
    await this.timingsRepo.createQueryBuilder()
      .delete()
      .from(Timings)
      .where('id = :id AND staffId = :sid', { id: timingId, sid: staffId })
      .execute();
    return { id: timingId, removed: true } as any;
  }

  async softDelete(id: string) {
    const staff = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!staff) return { id, removed: false } as any;
          const ongoing = await this.staffFulfillRepo.find({ where: { staff: { id } as any, endAt: IsNull() } });
    if (ongoing.length) {
      const counts: Record<string, number> = {};
      for (const f of ongoing) {
        const rid = (f as any).requirement?.id || (f as any).requirementId;
        if (rid) counts[rid] = (counts[rid] || 0) + 1;
      }
      const ids = ongoing.map(f => f.id);
      await this.staffFulfillRepo.delete(ids);
  
      const requirementIds = Object.keys(counts);
      if (requirementIds.length) {
        const reqs = await this.staffReqRepo.find({ where: { id: In(requirementIds) } });
        for (const req of reqs) {
          const dec = counts[req.id] || 0;
          req.fulfilledCount = Math.max((req.fulfilledCount || 0) - dec, 0);
          const remainingCount = await this.staffFulfillRepo.count({ where: { requirement: { id: req.id } as any } });
          if (remainingCount === 0) req.status = RequirementStatus.Open;
          else if (remainingCount < req.quantity) req.status = RequirementStatus.InProgress;
          else req.status = RequirementStatus.Fulfilled;
          await this.staffReqRepo.save(req);
        }
      }
    }
    if (staff.user?.id) {
      await this.repo.createQueryBuilder()
        .update(Staff)
        .set({ user: null as any })
        .where('id = :id', { id })
        .execute();
    }
    await this.repo.softDelete(id);
    return { id, removed: true } as any;
  }

  // Leaves CRUD
  listLeaves(staffId: string) {
    return this.leaveRepo.find({ where: { staff: { id: staffId } as any } });
  }

  getLeaveById(staffId: string, leaveId: string) {
    return this.leaveRepo.findOne({ where: { id: leaveId, staff: { id: staffId } as any } as any });
  }

  async updateLeave(staffId: string, leaveId: string, data: Partial<Leave>) {
    await this.leaveRepo.createQueryBuilder()
      .update(Leave)
      .set(data)
      .where('id = :id AND staffId = :sid', { id: leaveId, sid: staffId })
      .execute();
    return this.getLeaveById(staffId, leaveId);
  }

  async deleteLeave(staffId: string, leaveId: string) {
    await this.leaveRepo.createQueryBuilder()
      .delete()
      .from(Leave)
      .where('id = :id AND staffId = :sid', { id: leaveId, sid: staffId })
      .execute();
    return { id: leaveId, removed: true } as any;
  }
  
  async getTimingsTable(filter?: { role?: string; specialtyId?: string; weekday?: number }) {
    const staffRows = await this.findAll({ role: filter?.role, specialtyId: filter?.specialtyId });
    if (!staffRows.length) return [] as any[];
    const staffIds = staffRows.map(s => s.id);
    const tQ = this.timingsRepo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.staff', 's')
      .where('t.staffId IN (:...ids)', { ids: staffIds });
    if (typeof filter?.weekday === 'number') tQ.andWhere('t.weekday = :wd', { wd: filter!.weekday });
    const timings = await tQ.getMany();
    const timingMap: Record<string, any[]> = {};
    for (const t of timings) {
      const sid = (t as any)?.staff?.id as string;
      if (!timingMap[sid]) timingMap[sid] = [];
      timingMap[sid].push({ id: t.id, weekday: t.weekday, startTime: t.startTime, endTime: t.endTime, isAvailable: t.isAvailable, notes: t.notes });
    }
    return staffRows.map(s => {
      const name = [s.user?.firstName || '', s.user?.lastName || ''].join(' ').trim() || null;
      return { staffId: s.id, name, role: s.user?.role || null, timings: timingMap[s.id] || [] };
    });
  }

  // Specialties management
  async getSpecialties(staffId: string) {
    const raw = await this.repo.query(
      `SELECT ss.id, ss."staffId", ss."specialtyId", ss."primary", sp.code, sp.name, sp.description
       FROM staff_specialty ss
       JOIN specialty sp ON sp.id = ss."specialtyId"
       WHERE ss."staffId" = $1
       ORDER BY ss."primary" DESC, sp.name ASC`,
      [staffId],
    );
    return raw.map((r: any) => ({
      id: r.id,
      staffId: r.staffId,
      specialtyId: r.specialtyId,
      primary: r.primary,
      code: r.code,
      name: r.name,
      description: r.description,
    }));
  }

  async addSpecialty(staffId: string, specialtyId: string, primary: boolean = false) {
    console.log(staffId, specialtyId, primary)
    const specialtyExists = await this.repo.query(
      'SELECT 1 FROM specialty WHERE id = $1 LIMIT 1',
      [specialtyId],
    );
    if (!specialtyExists.length) {
      throw new Error(`Specialty with id ${specialtyId} does not exist`);
    }

    const existing = await this.repo.query(
      'SELECT 1 FROM staff_specialty WHERE "staffId" = $1 AND "specialtyId" = $2 LIMIT 1',
      [staffId, specialtyId],
    );
    if (existing.length) {
      throw new Error('Specialty already assigned to this staff member');
    }

    if (primary) {
      await this.repo.query(
        'UPDATE staff_specialty SET "primary" = false WHERE "staffId" = $1',
        [staffId],
      );
    }

    const result = await this.repo.query(
      'INSERT INTO staff_specialty ("staffId", "specialtyId", "primary") VALUES ($1, $2, $3) RETURNING id',
      [staffId, specialtyId, primary],
    );

    return this.getSpecialties(staffId);
  }

  async removeSpecialty(staffId: string, specialtyId: string) {
    const result = await this.repo.query(
      'DELETE FROM staff_specialty WHERE "staffId" = $1 AND "specialtyId" = $2 RETURNING id',
      [staffId, specialtyId],
    );
    if (!result.length) {
      throw new Error('Specialty assignment not found');
    }
    return { id: specialtyId, removed: true };
  }

  async getLeavesTable(filter?: { role?: string; specialtyId?: string; status?: string; from?: string; to?: string }) {
    const staffRows = await this.findAll({ role: filter?.role, specialtyId: filter?.specialtyId });
    if (!staffRows.length) return [] as any[];
    const staffIds = staffRows.map(s => s.id);
    const lQ = this.leaveRepo
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.staff', 's')
      .where('l.staffId IN (:...ids)', { ids: staffIds });
    if (filter?.status) lQ.andWhere('l.status = :st', { st: filter.status });
    const from = filter?.from; const to = filter?.to;
    if (from && to) lQ.andWhere('l.startDate <= :to AND l.endDate >= :from', { from, to });
    else if (from) lQ.andWhere('l.endDate >= :from', { from });
    else if (to) lQ.andWhere('l.startDate <= :to', { to });
    const leaves = await lQ.getMany();
    const leavesMap: Record<string, any[]> = {};
    for (const l of leaves) {
      const sid = (l as any)?.staff?.id as string;
      if (!leavesMap[sid]) leavesMap[sid] = [];
      leavesMap[sid].push({ id: l.id, startDate: l.startDate, endDate: l.endDate, status: l.status, reason: l.reason, notes: l.notes });
    }
    return staffRows.map(s => {
      const name = [s.user?.firstName || '', s.user?.lastName || ''].join(' ').trim() || null;
      return { staffId: s.id, name, role: s.user?.role || null, leaves: leavesMap[s.id] || [] };
    });
  }
}
