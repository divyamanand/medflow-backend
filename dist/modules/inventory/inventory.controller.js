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
        if (q.type)
            filter.type = q.type;
        if (q.lowStock)
            filter.lowStock = parseInt(q.lowStock, 10);
        if (q.expiryBefore)
            filter.expiryBefore = q.expiryBefore;
        if (q.expiry)
            filter.expiryBefore = q.expiry;
        return this.svc.listItems(filter).then(rows => rows.map(r => ({
            name: r.name,
            quantity: r.quantity,
            unit: r.unit,
            expiry: r.expiry || null,
        })));
    }
    listByType(type) {
        return this.svc.listItems({ type }).then(rows => rows.map(r => ({
            name: r.name,
            quantity: r.quantity,
            unit: r.unit,
            expiry: r.expiry || null,
        })));
    }
    create(body) { return this.svc.createItem(body); }
    update(id, body) { return this.svc.updateItem(id, body); }
    remove(id) { return this.svc.deleteItem(id); }
    getByName(name) { return this.svc.getItemByName(name); }
    adjust(id, body) {
        return this.svc.adjustItem(id, { quantity: body.change, reason: body.reason, refPrescriptionItemId: body.referenceId });
    }
    addStock(id, body) {
        var _a, _b;
        return this.svc.addStock(id, body === null || body === void 0 ? void 0 : body.quantity, body === null || body === void 0 ? void 0 : body.referenceId, (_a = body === null || body === void 0 ? void 0 : body.unit) !== null && _a !== void 0 ? _a : null, (_b = body === null || body === void 0 ? void 0 : body.expiry) !== null && _b !== void 0 ? _b : null);
    }
    dispense(id, body) { return this.svc.dispenseItem(id, body === null || body === void 0 ? void 0 : body.quantity, body === null || body === void 0 ? void 0 : body.referenceId); }
    removeExpired() { return this.svc.removeExpired(); }
    fulfillPrescription(id) { return this.svc.fulfillPrescription(id); }
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
    (0, common_1.Post)('inventory'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('inventory/:id'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('inventory/:id'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('inventory/by-name/:name'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getByName", null);
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
    (0, common_1.Post)('inventory/:id/add'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "addStock", null);
__decorate([
    (0, common_1.Post)('inventory/:id/dispense'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "dispense", null);
__decorate([
    (0, common_1.Delete)('inventory/remove-expired'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "removeExpired", null);
__decorate([
    (0, common_1.Post)('prescription/:id/fulfill'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "fulfillPrescription", null);
__decorate([
    (0, common_1.Get)('inventory/transactions'),
    (0, roles_decorator_1.Roles)('admin', 'pharmacist', 'inventory'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listTransactions", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
