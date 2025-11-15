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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRequirementFulfillment = void 0;
const typeorm_1 = require("typeorm");
const item_requirement_entity_1 = require("./item-requirement.entity");
const inventory_item_entity_1 = require("./inventory-item.entity");
let ItemRequirementFulfillment = class ItemRequirementFulfillment {
};
exports.ItemRequirementFulfillment = ItemRequirementFulfillment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ItemRequirementFulfillment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => item_requirement_entity_1.ItemRequirement, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'requirementId' }),
    __metadata("design:type", item_requirement_entity_1.ItemRequirement)
], ItemRequirementFulfillment.prototype, "requirement", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inventory_item_entity_1.InventoryItem, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'inventoryItemId' }),
    __metadata("design:type", inventory_item_entity_1.InventoryItem)
], ItemRequirementFulfillment.prototype, "inventoryItem", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ItemRequirementFulfillment.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ItemRequirementFulfillment.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ItemRequirementFulfillment.prototype, "endAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ItemRequirementFulfillment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ItemRequirementFulfillment.prototype, "updatedAt", void 0);
exports.ItemRequirementFulfillment = ItemRequirementFulfillment = __decorate([
    (0, typeorm_1.Entity)({ name: 'item_requirement_fulfillment' })
], ItemRequirementFulfillment);
