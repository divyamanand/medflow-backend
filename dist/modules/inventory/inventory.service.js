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
    async listItems(filter) {
        const qb = this.itemRepo.createQueryBuilder('i')
            .leftJoin(inventory_stock_entity_1.InventoryStock, 's', 's."inventoryItemId" = i.id')
            .select('i.id', 'id')
            .addSelect('i.name', 'name')
            .addSelect('i.type', 'type')
            .addSelect('i.unit', 'unit')
            .addSelect('COALESCE(SUM(s.quantity), 0)', 'quantity')
            .addSelect('MIN(s.expiry)', 'expiry')
            .groupBy('i.id');
        if (filter === null || filter === void 0 ? void 0 : filter.type)
            qb.andWhere('i.type = :type', { type: filter.type });
        if (filter === null || filter === void 0 ? void 0 : filter.lowStock)
            qb.having('COALESCE(SUM(s.quantity),0) < :ls', { ls: filter.lowStock });
        if (filter === null || filter === void 0 ? void 0 : filter.expiryBefore)
            qb.having('MIN(s.expiry) IS NOT NULL AND MIN(s.expiry) < :exp', { exp: filter.expiryBefore });
        const rows = await qb.getRawMany();
        return rows.map((r) => ({
            id: r.id,
            name: r.name,
            type: r.type,
            unit: r.unit,
            quantity: parseInt(r.quantity, 10) || 0,
            expiry: r.expiry || null,
        }));
    }
    listByType(type) { return this.itemRepo.find({ where: { type } }); }
    createItem(data) { return this.itemRepo.save(this.itemRepo.create(data)); }
    async updateItem(id, data) { await this.itemRepo.update({ id }, data); return this.itemRepo.findOne({ where: { id } }); }
    async deleteItem(id) { await this.itemRepo.delete({ id }); return { id, removed: true }; }
    getItemByName(name) {
        return this.itemRepo.createQueryBuilder('i')
            .where('LOWER(i.name) = LOWER(:name)', { name })
            .getOne();
    }
    async addStock(id, quantity, referenceId, unit, expiry) {
        var _a;
        const item = await this.itemRepo.findOne({ where: { id } });
        if (!item || quantity <= 0)
            return null;
        const stock = await this.stockRepo.save(this.stockRepo.create({ inventoryItem: item, quantity, unit: (_a = unit !== null && unit !== void 0 ? unit : item.unit) !== null && _a !== void 0 ? _a : null, expiry: expiry !== null && expiry !== void 0 ? expiry : null }));
        await this.txnRepo.save(this.txnRepo.create({ inventoryItem: item, type: 'in', quantity, reason: referenceId || null, refPrescriptionItemId: null }));
        await this.itemRepo.update({ id }, { quantity: (item.quantity || 0) + quantity });
        return stock;
    }
    async dispenseItem(id, quantity, referenceId) {
        const item = await this.itemRepo.findOne({ where: { id } });
        if (!item || quantity <= 0)
            return null;
        const qty = Math.abs(quantity);
        await this.txnRepo.save(this.txnRepo.create({ inventoryItem: item, type: 'out', quantity: qty, reason: referenceId || null, refPrescriptionItemId: null }));
        await this.itemRepo.update({ id }, { quantity: (item.quantity || 0) - qty });
        return this.itemRepo.findOne({ where: { id } });
    }
    async removeExpired() {
        const today = new Date();
        const iso = today.toISOString().slice(0, 10);
        const expired = await this.itemRepo.createQueryBuilder('i')
            .where('i.expiry IS NOT NULL AND i.expiry < :today', { today: iso })
            .getMany();
        const ids = expired.map(e => e.id);
        if (ids.length === 0)
            return { removed: 0 };
        await this.itemRepo.createQueryBuilder().delete().from(inventory_item_entity_1.InventoryItem).where('id IN (:...ids)', { ids }).execute();
        return { removed: ids.length, ids };
    }
    async adjustItem(id, body) {
        const item = await this.itemRepo.findOne({ where: { id } });
        if (!item)
            return null;
        await this.txnRepo.save(this.txnRepo.create({
            inventoryItem: item,
            type: 'adjust',
            quantity: body.quantity,
            reason: body.reason || null,
            refPrescriptionItemId: body.refPrescriptionItemId || null,
        }));
        await this.itemRepo.update({ id }, { quantity: (item.quantity || 0) + body.quantity });
        return this.itemRepo.findOne({ where: { id } });
    }
    async listTransactions(filter) {
        const qb = this.txnRepo.createQueryBuilder('t').leftJoinAndSelect('t.inventoryItem', 'item');
        qb.where('1=1');
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
