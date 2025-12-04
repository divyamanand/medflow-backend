"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_item_entity_1 = require("../../entities/inventory-item.entity");
const inventory_transaction_entity_1 = require("../../entities/inventory-transaction.entity");
const inventory_stock_entity_1 = require("../../entities/inventory-stock.entity");
const prescription_entity_1 = require("../../entities/prescription.entity");
const prescription_item_entity_1 = require("../../entities/prescription-item.entity");
let InventoryService = class InventoryService {
    constructor(itemRepo, txnRepo, stockRepo, presRepo, presItemRepo) {
        this.itemRepo = itemRepo;
        this.txnRepo = txnRepo;
        this.stockRepo = stockRepo;
        this.presRepo = presRepo;
        this.presItemRepo = presItemRepo;
    }
    async listItemsWithAggregates(filter) {
        const qb = this.itemRepo.createQueryBuilder('i')
            .leftJoin(inventory_stock_entity_1.InventoryStock, 's', 's."inventoryItemId" = i.id')
            .select('i.name', 'name')
            .addSelect('COALESCE(SUM(s.quantity), 0)', 'quantity')
            .addSelect('MIN(s.expiry)', 'expiry')
            .groupBy('i.id')
            .addGroupBy('i.name');
        if (filter === null || filter === void 0 ? void 0 : filter.type)
            qb.andWhere('i.type = :type', { type: filter.type });
        if (filter === null || filter === void 0 ? void 0 : filter.lowStock)
            qb.having('COALESCE(SUM(s.quantity),0) < :ls', { ls: filter.lowStock });
        if (filter === null || filter === void 0 ? void 0 : filter.expiryBefore)
            qb.having('MIN(s.expiry) IS NOT NULL AND MIN(s.expiry) < :exp', { exp: filter.expiryBefore });
        const rows = await qb.getRawMany();
        return rows.map((r) => ({
            name: r.name,
            quantity: parseInt(r.quantity, 10) || 0,
            expiry: r.expiry || null,
        }));
    }
    async listStocks(filter) {
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
        if (filter === null || filter === void 0 ? void 0 : filter.itemType)
            qb.andWhere('i.type = :t', { t: filter.itemType });
        if (filter === null || filter === void 0 ? void 0 : filter.lowStock)
            qb.andWhere('s.quantity < :ls', { ls: filter.lowStock });
        if (filter === null || filter === void 0 ? void 0 : filter.expiryBefore)
            qb.andWhere('s.expiry IS NOT NULL AND s.expiry < :exp', { exp: filter.expiryBefore });
        if (filter === null || filter === void 0 ? void 0 : filter.expiry)
            qb.andWhere('s.expiry = :expOn', { expOn: filter.expiry });
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
    async createItem(data) {
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
    async getItem(id) {
        const item = await this.itemRepo.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException(`Item with id '${id}' not found`);
        }
        return item;
    }
    async updateItem(id, data) {
        await this.getItem(id);
        await this.itemRepo.update({ id }, data);
        return this.getItem(id);
    }
    async deleteItem(id) {
        await this.getItem(id);
        await this.itemRepo.delete({ id });
        return { id, removed: true };
    }
    async searchItemsByName(keyword) {
        const items = await this.itemRepo.createQueryBuilder('i')
            .where('i.name ILIKE :kw', { kw: `%${keyword}%` })
            .orderBy('i.name', 'ASC')
            .getMany();
        return items;
    }
    async listStock(itemId) {
        await this.getItem(itemId);
        return this.stockRepo.find({
            where: { inventoryItem: { id: itemId } },
            order: { expiry: 'ASC', createdAt: 'ASC' }
        });
    }
    async addStock(itemId, quantity, expiry, notes) {
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
    async getStock(stockId) {
        const stock = await this.stockRepo.findOne({
            where: { id: stockId },
            relations: ['inventoryItem']
        });
        if (!stock) {
            throw new common_1.NotFoundException(`Stock with id '${stockId}' not found`);
        }
        return stock;
    }
    async updateStock(stockId, data) {
        await this.getStock(stockId);
        await this.stockRepo.update({ id: stockId }, data);
        return this.getStock(stockId);
    }
    async deleteStock(stockId) {
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
    async dispenseItem(itemId, quantity, referenceId) {
        const item = await this.getItem(itemId);
        if (!quantity || quantity <= 0) {
            throw new Error('Quantity must be positive');
        }
        const stocks = await this.stockRepo.find({
            where: { inventoryItem: { id: itemId } },
            order: { expiry: 'ASC', createdAt: 'ASC' }
        });
        let remaining = quantity;
        for (const stock of stocks) {
            if (remaining <= 0)
                break;
            const toTake = Math.min(stock.quantity, remaining);
            stock.quantity -= toTake;
            remaining -= toTake;
            if (stock.quantity === 0) {
                await this.stockRepo.delete({ id: stock.id });
            }
            else {
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
    async adjustItem(itemId, body) {
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
        }
        else if (body.quantity < 0) {
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
    async listTransactions(filter) {
        const qb = this.txnRepo.createQueryBuilder('t')
            .leftJoinAndSelect('t.inventoryItem', 'item')
            .where('1=1');
        if (filter === null || filter === void 0 ? void 0 : filter.itemId)
            qb.andWhere('t.inventoryItemId = :iid', { iid: filter.itemId });
        if (filter === null || filter === void 0 ? void 0 : filter.type)
            qb.andWhere('t.type = :tt', { tt: filter.type });
        if (filter === null || filter === void 0 ? void 0 : filter.from)
            qb.andWhere('t.createdAt >= :from', { from: filter.from });
        if (filter === null || filter === void 0 ? void 0 : filter.to)
            qb.andWhere('t.createdAt <= :to', { to: filter.to });
        qb.orderBy('t.createdAt', 'DESC');
        return qb.getMany();
    }
    async fulfillPrescription(prescriptionId) {
        return { id: prescriptionId, status: 'not_implemented' };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __param(1, (0, typeorm_1.InjectRepository)(inventory_transaction_entity_1.InventoryTransaction)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_stock_entity_1.InventoryStock)),
    __param(3, (0, typeorm_1.InjectRepository)(prescription_entity_1.Prescription)),
    __param(4, (0, typeorm_1.InjectRepository)(prescription_item_entity_1.PrescriptionItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryService);
