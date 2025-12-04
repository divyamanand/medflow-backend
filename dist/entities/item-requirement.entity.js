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
exports.ItemRequirement = exports.RequirementStatus = void 0;
const typeorm_1 = require("typeorm");
var RequirementStatus;
(function (RequirementStatus) {
    RequirementStatus["Open"] = "open";
    RequirementStatus["InProgress"] = "inProgress";
    RequirementStatus["Fulfilled"] = "fulfilled";
    RequirementStatus["Cancelled"] = "cancelled";
})(RequirementStatus || (exports.RequirementStatus = RequirementStatus = {}));
let ItemRequirement = class ItemRequirement {
};
exports.ItemRequirement = ItemRequirement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ItemRequirement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ItemRequirement.prototype, "primaryUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], ItemRequirement.prototype, "kind", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ItemRequirement.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ItemRequirement.prototype, "fulfilledCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ItemRequirement.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ItemRequirement.prototype, "estimatedEndTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RequirementStatus, default: RequirementStatus.Open }),
    __metadata("design:type", String)
], ItemRequirement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ItemRequirement.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ItemRequirement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ItemRequirement.prototype, "updatedAt", void 0);
exports.ItemRequirement = ItemRequirement = __decorate([
    (0, typeorm_1.Entity)({ name: 'item_requirement' })
], ItemRequirement);
