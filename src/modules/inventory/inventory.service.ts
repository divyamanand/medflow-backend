import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { InventoryTransaction } from '../../entities/inventory-transaction.entity';
import { InventoryStock } from '../../entities/inventory-stock.entity';
import { Prescription } from '../../entities/prescription.entity';
import { PrescriptionItem } from '../../entities/prescription-item.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem) private itemRepo: Repository<InventoryItem>,
    @InjectRepository(InventoryTransaction) private txnRepo: Repository<InventoryTransaction>,
    @InjectRepository(InventoryStock) private stockRepo: Repository<InventoryStock>,
    @InjectRepository(Prescription) private presRepo: Repository<Prescription>,
    @InjectRepository(PrescriptionItem) private presItemRepo: Repository<PrescriptionItem>,
  ) {}


  async listItemsWithAggregates(filter?: any) {
    const qb = this.itemRepo.createQueryBuilder('i')
      .leftJoin(InventoryStock, 's', 's."inventoryItemId" = i.id')
      .select('i.name', 'name')
      .addSelect('COALESCE(SUM(s.quantity), 0)', 'quantity')
      .addSelect('MIN(s.expiry)', 'expiry')
      .groupBy('i.id')
      .addGroupBy('i.name');

    if (filter?.type) qb.andWhere('i.type = :type', { type: filter.type });
    if (filter?.lowStock) qb.having('COALESCE(SUM(s.quantity),0) < :ls', { ls: filter.lowStock });
    if (filter?.expiryBefore) qb.having('MIN(s.expiry) IS NOT NULL AND MIN(s.expiry) < :exp', { exp: filter.expiryBefore });

    const rows = await qb.getRawMany();
    return rows.map((r: any) => ({
      name: r.name,
      quantity: parseInt(r.quantity, 10) || 0,
      expiry: r.expiry || null,
    }));
  }

  async listStocks(filter?: any) {
    const qb = this.stockRepo.createQueryBuilder('s')
      .leftJoinAndSelect('s.inventoryItem', 'i')
      .select([
        's.id as stockId',
        'i.name as name',
        's.quantity as quantity',
        's.expiry as expiry',
        's.notes as notes',
        's.createdAt as created',
        's.updatedAt as updated',
      ])
      .where('1=1');

    if (filter?.itemType) qb.andWhere('i.type = :t', { t: filter.itemType });
    if (filter?.lowStock) qb.andWhere('s.quantity < :ls', { ls: filter.lowStock });
    if (filter?.expiryBefore) qb.andWhere('s.expiry IS NOT NULL AND s.expiry < :exp', { exp: filter.expiryBefore });
    if (filter?.expiry) qb.andWhere('s.expiry = :expOn', { expOn: filter.expiry });

    qb.orderBy('s.expiry', 'ASC');
    const rows = await qb.getRawMany();
    return rows.map(r => ({
      stockId: r.stockid,
      name: r.name,
      quantity: typeof r.quantity === 'string' ? parseInt(r.quantity, 10) : r.quantity,
      expiry: r.expiry || null,
      notes: r.notes || null,
      created: r.created,
      updated: r.updated,
    }));
  }

  async createItem(data: { name: string; type: InventoryItem['type']; manufacturer?: string; description?: string }) {
    if (!data.name || !data.type) {
      throw new Error('Name and type are required');
    }
    return this.itemRepo.save(this.itemRepo.create({
      name: data.name,
      type: data.type,
      manufacturer: data.manufacturer || null,
      description: data.description || null,
    }));
  }

  async getItem(id: string) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with id '${id}' not found`);
    }
    return item;
  }

  async updateItem(id: string, data: Partial<InventoryItem>) {
    await this.getItem(id); // Validate exists
    await this.itemRepo.update({ id }, data);
    return this.getItem(id);
  }

  async deleteItem(id: string) {
    await this.getItem(id); // Validate exists
    await this.itemRepo.delete({ id });
    return { id, removed: true };
  }

  async searchItemsByName(keyword: string) {
    const items = await this.itemRepo.createQueryBuilder('i')
      .where('i.name ILIKE :kw', { kw: `%${keyword}%` })
      .orderBy('i.name', 'ASC')
      .getMany();
    return items;
  }


  async listStock(itemId: string) {
    await this.getItem(itemId);
    return this.stockRepo.find({ 
      where: { inventoryItem: { id: itemId } as any },
      order: { expiry: 'ASC', createdAt: 'ASC' }
    });
  }

  async addStock(
    itemId: string, 
    quantity: number, 
    expiry?: string, 
    notes?: string,
  ) {
    const item = await this.getItem(itemId); 
    
    if (!quantity || quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    const stock = this.stockRepo.create({
      inventoryItem: item,
      quantity,
      expiry: expiry || null,
      notes: notes || null,
    });

    await this.stockRepo.save(stock);

    await this.txnRepo.save(this.txnRepo.create({
      inventoryItem: item,
      type: 'in',
      quantity,
      reason: 'Stock added',
    }));

    return stock;
  }

  async getStock(stockId: string) {
    const stock = await this.stockRepo.findOne({ 
      where: { id: stockId },
      relations: ['inventoryItem']
    });
    if (!stock) {
      throw new NotFoundException(`Stock with id '${stockId}' not found`);
    }
    return stock;
  }

  async updateStock(stockId: string, data: { quantity?: number; expiry?: string; notes?: string }) {
    await this.getStock(stockId); 
    await this.stockRepo.update({ id: stockId }, data);
    return this.getStock(stockId);
  }

  async deleteStock(stockId: string) {
    const stock = await this.getStock(stockId);
    
    await this.txnRepo.save(this.txnRepo.create({
      inventoryItem: stock.inventoryItem,
      type: 'out',
      quantity: stock.quantity,
      reason: 'Stock deleted',
    }));

    await this.stockRepo.delete({ id: stockId });
    return { id: stockId, removed: true };
  }


  async dispenseItem(itemId: string, quantity: number, referenceId?: string) {
    const item = await this.getItem(itemId);
    
    if (!quantity || quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    const stocks = await this.stockRepo.find({
      where: { inventoryItem: { id: itemId } as any },
      order: { expiry: 'ASC', createdAt: 'ASC' }
    });

    let remaining = quantity;
    for (const stock of stocks) {
      if (remaining <= 0) break;
      
      const toTake = Math.min(stock.quantity, remaining);
      stock.quantity -= toTake;
      remaining -= toTake;

      if (stock.quantity === 0) {
        await this.stockRepo.delete({ id: stock.id });
      } else {
        await this.stockRepo.save(stock);
      }
    }

    if (remaining > 0) {
      throw new Error(`Insufficient stock. Short by ${remaining} units.`);
    }

    await this.txnRepo.save(this.txnRepo.create({
      inventoryItem: item,
      type: 'out',
      quantity,
      reason: referenceId || 'Dispensed',
    }));

    return { itemId, dispensed: quantity, reference: referenceId };
  }

  async adjustItem(itemId: string, body: { quantity: number; reason?: string; refPrescriptionItemId?: string }) {
    const item = await this.getItem(itemId);

    await this.txnRepo.save(this.txnRepo.create({
      inventoryItem: item,
      type: 'adjust',
      quantity: body.quantity,
      reason: body.reason || 'Manual adjustment',
    }));

    if (body.quantity > 0) {
      await this.stockRepo.save(this.stockRepo.create({
        inventoryItem: item,
        quantity: body.quantity,
        expiry: null,
        notes: null,
      }));
    } else if (body.quantity < 0) {
      await this.dispenseItem(itemId, Math.abs(body.quantity), body.reason);
    }

    return { itemId, adjusted: body.quantity };
  }

  async removeExpiredStocks() {
    const today = new Date().toISOString().slice(0, 10);
    const expired = await this.stockRepo
      .createQueryBuilder('s')
      .where('s.expiry IS NOT NULL AND s.expiry < :today', { today })
      .getMany();

    const ids = expired.map(e => e.id);
    if (ids.length === 0) {
      return { removed: 0, ids: [] };
    }

    for (const stock of expired) {
      await this.txnRepo.save(this.txnRepo.create({
        inventoryItem: stock.inventoryItem,
        type: 'out',
        quantity: stock.quantity,
        reason: `Expired (${stock.expiry})`,
      }));
    }

    await this.stockRepo.delete(ids);
    return { removed: ids.length, ids };
  }

  async listTransactions(filter?: any) {
    const qb = this.txnRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.inventoryItem', 'item')
      .where('1=1');

    if (filter?.itemId) qb.andWhere('t.inventoryItemId = :iid', { iid: filter.itemId });
    if (filter?.type) qb.andWhere('t.type = :tt', { tt: filter.type });
    if (filter?.from) qb.andWhere('t.createdAt >= :from', { from: filter.from });
    if (filter?.to) qb.andWhere('t.createdAt <= :to', { to: filter.to });
    
    qb.orderBy('t.createdAt', 'DESC');
    return qb.getMany();
  }

  async fulfillPrescription(prescriptionId: string) {
    return { id: prescriptionId, status: 'not_implemented' };
  }
}
