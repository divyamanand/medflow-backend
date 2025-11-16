import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemRequirement, RequirementStatus } from '../../entities/item-requirement.entity';
import { ItemRequirementFulfillment } from '../../entities/item-requirement-fulfillment.entity';
import { StaffRequirement } from '../../entities/staff-requirement.entity';
import { StaffRequirementFulfillment } from '../../entities/staff-requirement-fulfillment.entity';
import { RoomRequirement } from '../../entities/room-requirement.entity';
import { RoomRequirementFulfillment } from '../../entities/room-requirement-fulfillment.entity';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { InventoryTransaction } from '../../entities/inventory-transaction.entity';
import { Room } from '../../entities/room.entity';
import { Staff } from '../../entities/staff.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class RequirementService {
  constructor(
    @InjectRepository(ItemRequirement) private readonly itemReqRepo: Repository<ItemRequirement>,
    @InjectRepository(ItemRequirementFulfillment) private readonly itemFulfillRepo: Repository<ItemRequirementFulfillment>,
    @InjectRepository(InventoryItem) private readonly invRepo: Repository<InventoryItem>,
    @InjectRepository(InventoryTransaction) private readonly txnRepo: Repository<InventoryTransaction>,
    @InjectRepository(StaffRequirement) private readonly staffReqRepo: Repository<StaffRequirement>,
    @InjectRepository(StaffRequirementFulfillment) private readonly staffFulfillRepo: Repository<StaffRequirementFulfillment>,
    @InjectRepository(RoomRequirement) private readonly roomReqRepo: Repository<RoomRequirement>,
    @InjectRepository(RoomRequirementFulfillment) private readonly roomFulfillRepo: Repository<RoomRequirementFulfillment>,
  ) {}

  // Item Requirements
  listItemRequirements() { return this.itemReqRepo.find({ order: { createdAt: 'DESC' } }); }
  async getItemRequirement(id: string) {
    const r = await this.itemReqRepo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Item requirement not found');
    return r;
  }
  createItemRequirement(body: Partial<ItemRequirement>) {
    const r = this.itemReqRepo.create({
      primaryUserId: body.primaryUserId!,
      kind: body.kind as any,
      quantity: body.quantity!,
      notes: body.notes ?? null,
      status: RequirementStatus.Open,
      startTime: body.startTime ? new Date(body.startTime as any) as any : null,
      estimatedEndTime: body.estimatedEndTime ? new Date(body.estimatedEndTime as any) as any : null,
    });
    return this.itemReqRepo.save(r);
  }
  async updateItemRequirement(id: string, body: Partial<ItemRequirement>) {
    const r = await this.getItemRequirement(id);
    if (typeof body.status !== 'undefined') r.status = body.status;
    if (typeof body.notes !== 'undefined') r.notes = body.notes ?? null;
    if (typeof body.quantity !== 'undefined') r.quantity = body.quantity!;
    if (typeof body.startTime !== 'undefined') r.startTime = body.startTime ? new Date(body.startTime as any) as any : null;
    if (typeof body.estimatedEndTime !== 'undefined') r.estimatedEndTime = body.estimatedEndTime ? new Date(body.estimatedEndTime as any) as any : null;
    return this.itemReqRepo.save(r);
  }
  async listItemFulfillments(requirementId: string) {
    await this.getItemRequirement(requirementId);
    return this.itemFulfillRepo.find({ where: { requirement: { id: requirementId } as any }, order: { createdAt: 'ASC' } });
  }
  async createItemFulfillment(requirementId: string, body: { inventoryItemId: string; quantity: number; startAt?: string | null; endAt?: string | null; }) {
    const req = await this.getItemRequirement(requirementId);
    if (req.status === RequirementStatus.Open) {
      req.status = RequirementStatus.InProgress;
      await this.itemReqRepo.save(req);
    }
    if (!body.inventoryItemId || !body.quantity || body.quantity <= 0) {
      throw new Error('inventoryItemId and positive quantity are required');
    }

    const item = await this.invRepo.findOne({ where: { id: body.inventoryItemId } });
    if (!item) throw new NotFoundException('Inventory item not found');

    const f = this.itemFulfillRepo.create({
      requirement: { id: requirementId } as any,
      inventoryItem: { id: body.inventoryItemId } as any,
      quantity: body.quantity,
      startAt: body.startAt ? new Date(body.startAt) : null,
      endAt: body.endAt ? new Date(body.endAt) : null,
      notes: (body as any).notes ?? null,
    });
    const saved = await this.itemFulfillRepo.save(f);
    // Create transaction (type 'fulfill') and update cached stock quantity
    await this.txnRepo.save(this.txnRepo.create({
      inventoryItem: item,
      type: 'fulfill',
      quantity: body.quantity,
      reason: requirementId,
      refPrescriptionItemId: null,
    }));
    await this.invRepo.update({ id: item.id }, { quantity: Math.max((item.quantity || 0) - body.quantity, 0) });

    // Increment fulfilledCount by 1 per fulfillment record
    await this.itemReqRepo.increment({ id: requirementId }, 'fulfilledCount', 1);

    await this.recomputeItemRequirementStatus(requirementId);
    return saved;
  }
  async updateItemFulfillment(fulfillmentId: string, body: { startAt?: string | null; endAt?: string | null; quantity?: number }) {
    const f = await this.itemFulfillRepo.findOne({ where: { id: fulfillmentId }, relations: { requirement: true } });
    if (!f) throw new NotFoundException('Item fulfillment not found');
    if (typeof body.startAt !== 'undefined') f.startAt = body.startAt ? new Date(body.startAt) : null;
    if (typeof body.endAt !== 'undefined') f.endAt = body.endAt ? new Date(body.endAt) : null;
    if (typeof body.quantity !== 'undefined') f.quantity = body.quantity!;
    if (typeof (body as any).notes !== 'undefined') f.notes = (body as any).notes ?? null;
    const saved = await this.itemFulfillRepo.save(f);
    await this.recomputeItemRequirementStatus(f.requirement.id);
    return saved;
  }
  private async recomputeItemRequirementStatus(requirementId: string) {
    const req = await this.getItemRequirement(requirementId);
    const raw = await this.itemFulfillRepo.createQueryBuilder('f')
      .select('COALESCE(SUM(f.quantity),0)', 'sum')
      .where('f.requirementId = :id', { id: requirementId })
      .getRawOne<{ sum: string }>();
    const total = parseInt((raw?.sum ?? '0'), 10);
    if (total >= req.quantity && req.status !== RequirementStatus.Fulfilled) {
      req.status = RequirementStatus.Fulfilled;
      await this.itemReqRepo.save(req);
    } else if (total > 0 && req.status === RequirementStatus.Open) {
      req.status = RequirementStatus.InProgress;
      await this.itemReqRepo.save(req);
    }
  }

  // Staff Requirements
  listStaffRequirements() { return this.staffReqRepo.find({ order: { createdAt: 'DESC' } }); }
  async getStaffRequirement(id: string) {
    const r = await this.staffReqRepo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Staff requirement not found');
    return r;
  }
  createStaffRequirement(body: Partial<StaffRequirement>) {
    const r = this.staffReqRepo.create({
      primaryUserId: body.primaryUserId!,
      roleNeeded: body.roleNeeded!,
      quantity: body.quantity!,
      notes: body.notes ?? null,
      status: RequirementStatus.Open,
      startTime: body.startTime ? new Date(body.startTime as any) as any : null,
      estimatedEndTime: body.estimatedEndTime ? new Date(body.estimatedEndTime as any) as any : null,
    });
    return this.staffReqRepo.save(r);
  }
  async updateStaffRequirement(id: string, body: Partial<StaffRequirement>) {
    const r = await this.getStaffRequirement(id);
    if (typeof body.status !== 'undefined') r.status = body.status;
    if (typeof body.notes !== 'undefined') r.notes = body.notes ?? null;
    if (typeof body.quantity !== 'undefined') r.quantity = body.quantity!;
    if (typeof body.roleNeeded !== 'undefined') r.roleNeeded = body.roleNeeded!;
    if (typeof body.startTime !== 'undefined') r.startTime = body.startTime ? new Date(body.startTime as any) as any : null;
    if (typeof body.estimatedEndTime !== 'undefined') r.estimatedEndTime = body.estimatedEndTime ? new Date(body.estimatedEndTime as any) as any : null;
    return this.staffReqRepo.save(r);
  }
  async listStaffFulfillments(requirementId: string) {
    await this.getStaffRequirement(requirementId);
    return this.staffFulfillRepo.find({ where: { requirement: { id: requirementId } as any }, order: { createdAt: 'ASC' } });
  }
  async createStaffFulfillment(requirementId: string, body: { staffId: string; startAt?: string | null; endAt?: string | null; }) {
    const req = await this.getStaffRequirement(requirementId);
    if (req.status === RequirementStatus.Open) {
      req.status = RequirementStatus.InProgress;
      await this.staffReqRepo.save(req);
    }
    const f = this.staffFulfillRepo.create({
      requirement: { id: requirementId } as any,
      staff: { id: body.staffId } as any,
      startAt: body.startAt ? new Date(body.startAt) : null,
      endAt: body.endAt ? new Date(body.endAt) : null,
      notes: (body as any).notes ?? null,
    });
    const saved = await this.staffFulfillRepo.save(f);
    // Increment fulfilled count per fulfillment
    await this.staffReqRepo.increment({ id: requirementId }, 'fulfilledCount', 1);
    await this.recomputeStaffRequirementStatus(requirementId);
    return saved;
  }
  async updateStaffFulfillment(fulfillmentId: string, body: { startAt?: string | null; endAt?: string | null; }) {
    const f = await this.staffFulfillRepo.findOne({ where: { id: fulfillmentId }, relations: { requirement: true } });
    if (!f) throw new NotFoundException('Staff fulfillment not found');
    if (typeof body.startAt !== 'undefined') f.startAt = body.startAt ? new Date(body.startAt) : null;
    if (typeof body.endAt !== 'undefined') f.endAt = body.endAt ? new Date(body.endAt) : null;
    if (typeof (body as any).notes !== 'undefined') f.notes = (body as any).notes ?? null;
    const saved = await this.staffFulfillRepo.save(f);
    await this.recomputeStaffRequirementStatus(f.requirement.id);
    return saved;
  }
  private async recomputeStaffRequirementStatus(requirementId: string) {
    const req = await this.getStaffRequirement(requirementId);
    const total = await this.staffFulfillRepo.count({ where: { requirement: { id: requirementId } as any } });
    if (total >= req.quantity && req.status !== RequirementStatus.Fulfilled) {
      req.status = RequirementStatus.Fulfilled;
      await this.staffReqRepo.save(req);
    } else if (total > 0 && req.status === RequirementStatus.Open) {
      req.status = RequirementStatus.InProgress;
      await this.staffReqRepo.save(req);
    }
  }

  // Room Requirements
  listRoomRequirements() { return this.roomReqRepo.find({ order: { createdAt: 'DESC' } }); }
  async getRoomRequirement(id: string) {
    const r = await this.roomReqRepo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Room requirement not found');
    return r;
    }
  createRoomRequirement(body: Partial<RoomRequirement>) {
    const r = this.roomReqRepo.create({
      primaryUserId: body.primaryUserId!,
      roomType: body.roomType!,
      quantity: body.quantity!,
      notes: body.notes ?? null,
      status: RequirementStatus.Open,
      startTime: body.startTime ? new Date(body.startTime as any) as any : null,
      estimatedEndTime: body.estimatedEndTime ? new Date(body.estimatedEndTime as any) as any : null,
    });
    return this.roomReqRepo.save(r);
  }
  async updateRoomRequirement(id: string, body: Partial<RoomRequirement>) {
    const r = await this.getRoomRequirement(id);
    if (typeof body.status !== 'undefined') r.status = body.status;
    if (typeof body.notes !== 'undefined') r.notes = body.notes ?? null;
    if (typeof body.quantity !== 'undefined') r.quantity = body.quantity!;
    if (typeof body.roomType !== 'undefined') r.roomType = body.roomType!;
    if (typeof body.startTime !== 'undefined') r.startTime = body.startTime ? new Date(body.startTime as any) as any : null;
    if (typeof body.estimatedEndTime !== 'undefined') r.estimatedEndTime = body.estimatedEndTime ? new Date(body.estimatedEndTime as any) as any : null;
    return this.roomReqRepo.save(r);
  }
  async listRoomFulfillments(requirementId: string) {
    await this.getRoomRequirement(requirementId);
    return this.roomFulfillRepo.find({ where: { requirement: { id: requirementId } as any }, order: { createdAt: 'ASC' } });
  }
  async createRoomFulfillment(requirementId: string, body: { roomId: string; startAt?: string | null; endAt?: string | null; }) {
    const req = await this.getRoomRequirement(requirementId);
    if (req.status === RequirementStatus.Open) {
      req.status = RequirementStatus.InProgress;
      await this.roomReqRepo.save(req);
    }
    const f = this.roomFulfillRepo.create({
      requirement: { id: requirementId } as any,
      room: { id: body.roomId } as any,
      startAt: body.startAt ? new Date(body.startAt) : null,
      endAt: body.endAt ? new Date(body.endAt) : null,
      notes: (body as any).notes ?? null,
    });
    const saved = await this.roomFulfillRepo.save(f);
    // Increment fulfilled count per fulfillment
    await this.roomReqRepo.increment({ id: requirementId }, 'fulfilledCount', 1);
    await this.recomputeRoomRequirementStatus(requirementId);
    return saved;
  }
  async updateRoomFulfillment(fulfillmentId: string, body: { startAt?: string | null; endAt?: string | null; }) {
    const f = await this.roomFulfillRepo.findOne({ where: { id: fulfillmentId }, relations: { requirement: true } });
    if (!f) throw new NotFoundException('Room fulfillment not found');
    if (typeof body.startAt !== 'undefined') f.startAt = body.startAt ? new Date(body.startAt) : null;
    if (typeof body.endAt !== 'undefined') f.endAt = body.endAt ? new Date(body.endAt) : null;
    if (typeof (body as any).notes !== 'undefined') f.notes = (body as any).notes ?? null;
    const saved = await this.roomFulfillRepo.save(f);
    await this.recomputeRoomRequirementStatus(f.requirement.id);
    return saved;
  }
  private async recomputeRoomRequirementStatus(requirementId: string) {
    const req = await this.getRoomRequirement(requirementId);
    const total = await this.roomFulfillRepo.count({ where: { requirement: { id: requirementId } as any } });
    if (total >= req.quantity && req.status !== RequirementStatus.Fulfilled) {
      req.status = RequirementStatus.Fulfilled;
      await this.roomReqRepo.save(req);
    } else if (total > 0 && req.status === RequirementStatus.Open) {
      req.status = RequirementStatus.InProgress;
      await this.roomReqRepo.save(req);
    }
  }

  // Aggregated fulfillment tables
  async getItemFulfillmentsTable() {
    const rows = await this.itemFulfillRepo
      .createQueryBuilder('f')
      .innerJoin(ItemRequirement, 'r', 'r.id = f.requirementId')
      .leftJoin(InventoryItem, 'ii', 'ii.id = f.inventoryItemId')
      .select([
        'r.id as requirementId',
        'r.quantity as requirementQuantity',
        'r.notes as requirementNotes',
        'r.startTime as requirementStartTime',
        'r.estimatedEndTime as requirementEndTime',
        'f.inventoryItemId as itemId',
        'ii.name as itemName',
      ])
      .orderBy('r.createdAt', 'DESC')
      .addOrderBy('f.createdAt', 'DESC')
      .getRawMany();
    return rows.map((r: any) => ({
      requirementId: r.requirementId,
      quantity: Number(r.requirementQuantity),
      notes: r.requirementNotes ?? null,
      startTime: r.requirementStartTime ?? null,
      endTime: r.requirementEndTime ?? null,
      itemId: r.itemId,
      itemName: r.itemName ?? null,
    }));
  }

  async getStaffFulfillmentsTable() {
    const rows = await this.staffFulfillRepo
      .createQueryBuilder('f')
      .innerJoin(StaffRequirement, 'r', 'r.id = f.requirementId')
      .leftJoin(Staff, 's', 's.id = f.staffId')
      .leftJoin(User, 'u', 'u.id = s.userId')
      .select([
        'f.id as id',
        'f.requirementId as requirementId',
        'f.staffId as staffId',
        'f.startAt as startAt',
        'f.endAt as endAt',
        'f.notes as notes',
        'f.createdAt as createdAt',
        'f.updatedAt as updatedAt',
        'u.role as staffRole',
        "(COALESCE(u.firstName,'') || ' ' || COALESCE(u.lastName,'')) as staffName",
      ])
      .orderBy('f.createdAt', 'DESC')
      .getRawMany();
    return rows.map((r: any) => ({
      id: r.id,
      requirementId: r.requirementId,
      staffId: r.staffId,
      startAt: r.startAt ?? null,
      endAt: r.endAt ?? null,
      notes: r.notes ?? null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      staffName: (r.staffName || '').trim() || null,
      staffRole: r.staffRole ?? null,
    }));
  }

  async getRoomFulfillmentsTable() {
    const rows = await this.roomFulfillRepo
      .createQueryBuilder('f')
      .innerJoin(RoomRequirement, 'r', 'r.id = f.requirementId')
      .leftJoin(Room, 'room', 'room.id = f.roomId')
      .select([
        'f.id as id',
        'f.requirementId as requirementId',
        'f.roomId as roomId',
        'f.startAt as startAt',
        'f.endAt as endAt',
        'f.notes as notes',
        'f.createdAt as createdAt',
        'f.updatedAt as updatedAt',
        'room.name as roomName',
      ])
      .orderBy('f.createdAt', 'DESC')
      .getRawMany();
    return rows.map((r: any) => ({
      id: r.id,
      requirementId: r.requirementId,
      roomId: r.roomId,
      startAt: r.startAt ?? null,
      endAt: r.endAt ?? null,
      notes: r.notes ?? null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      roomName: r.roomName ?? null,
    }));
  }

  // RAW lists for fulfillments (no joins, no reshaping)
  listAllItemFulfillmentsRaw() {
    return this.itemFulfillRepo.find({ order: { createdAt: 'DESC' } });
  }
  listAllStaffFulfillmentsRaw() {
    return this.staffFulfillRepo.find({ order: { createdAt: 'DESC' } });
  }
  listAllRoomFulfillmentsRaw() {
    return this.roomFulfillRepo.find({ order: { createdAt: 'DESC' } });
  }
}
