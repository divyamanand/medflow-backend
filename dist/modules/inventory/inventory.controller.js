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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let InventoryController = class InventoryController {
    constructor(svc) {
        this.svc = svc;
    }
    list(q) {
        const filter = {};
        if (q.itemType)
            filter.itemType = q.itemType;
        if (q.lowStock)
            filter.lowStock = parseInt(q.lowStock, 10);
        if (q.expiryBefore)
            filter.expiryBefore = q.expiryBefore;
        if (q.expiry)
            filter.expiryBefore = q.expiry;
        return this.svc.listStocks(filter);
    }
    listByType(type) {
        return this.svc.listStocks({ itemType: type });
    }
    getByName(name) {
        return this.svc.searchItemsByName(name);
    }
    listTransactions(q) {
        const filter = {};
        if (q.itemId)
            filter.itemId = q.itemId;
        if (q.type)
            filter.type = q.type;
        if (q.from)
            filter.from = q.from;
        if (q.to)
            filter.to = q.to;
        return this.svc.listTransactions(filter);
    }
    removeExpired() {
        return this.svc.removeExpiredStocks();
    }
    createItem(body) {
        return this.svc.createItem(body);
    }
    getItem(id) {
        return this.svc.getItem(id);
    }
    updateItem(id, body) {
        return this.svc.updateItem(id, body);
    }
    deleteItem(id) {
        return this.svc.deleteItem(id);
    }
    listStock(itemId) {
        return this.svc.listStock(itemId);
    }
    addStock(itemId, body) {
        return this.svc.addStock(itemId, body.quantity, body.expiry, body.notes);
    }
    getStock(itemId, stockId) {
        return this.svc.getStock(stockId);
    }
    updateStock(itemId, stockId, body) {
        return this.svc.updateStock(stockId, body);
    }
    deleteStock(itemId, stockId) {
        return this.svc.deleteStock(stockId);
    }
    fulfillPrescription(id) {
        return this.svc.fulfillPrescription(id);
    }
    adjust(id, body) {
        return this.svc.adjustItem(id, { quantity: body.change, reason: body.reason, refPrescriptionItemId: body.referenceId });
    }
    dispense(id, body) {
        return this.svc.dispenseItem(id, body === null || body === void 0 ? void 0 : body.quantity, body === null || body === void 0 ? void 0 : body.referenceId);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('inventory'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('inventory/type/:type'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listByType", null);
__decorate([
    (0, common_1.Get)('inventory/by-name/:name'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getByName", null);
__decorate([
    (0, common_1.Get)('inventory/transactions'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listTransactions", null);
__decorate([
    (0, common_1.Delete)('inventory/remove-expired'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "removeExpired", null);
__decorate([
    (0, common_1.Post)('inventory'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createItem", null);
__decorate([
    (0, common_1.Get)('inventory/:id'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getItem", null);
__decorate([
    (0, common_1.Put)('inventory/:id'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('inventory/:id'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteItem", null);
__decorate([
    (0, common_1.Get)('inventory/:itemId/stock'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listStock", null);
__decorate([
    (0, common_1.Post)('inventory/:itemId/stock'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "addStock", null);
__decorate([
    (0, common_1.Get)('inventory/:itemId/stock/:stockId'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Param)('stockId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getStock", null);
__decorate([
    (0, common_1.Put)('inventory/:itemId/stock/:stockId'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Param)('stockId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Delete)('inventory/:itemId/stock/:stockId'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Param)('stockId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteStock", null);
__decorate([
    (0, common_1.Post)('prescription/:id/fulfill'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "fulfillPrescription", null);
__decorate([
    (0, common_1.Post)('inventory/:id/adjust'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "adjust", null);
__decorate([
    (0, common_1.Post)('inventory/:id/dispense'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "dispense", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
