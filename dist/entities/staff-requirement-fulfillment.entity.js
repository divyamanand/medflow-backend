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
exports.StaffRequirementFulfillment = void 0;
const typeorm_1 = require("typeorm");
const staff_requirement_entity_1 = require("./staff-requirement.entity");
const staff_entity_1 = require("./staff.entity");
let StaffRequirementFulfillment = class StaffRequirementFulfillment {
};
exports.StaffRequirementFulfillment = StaffRequirementFulfillment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StaffRequirementFulfillment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_requirement_entity_1.StaffRequirement, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'requirementId' }),
    __metadata("design:type", staff_requirement_entity_1.StaffRequirement)
], StaffRequirementFulfillment.prototype, "requirement", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'staffId' }),
    __metadata("design:type", Object)
], StaffRequirementFulfillment.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], StaffRequirementFulfillment.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], StaffRequirementFulfillment.prototype, "endAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], StaffRequirementFulfillment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StaffRequirementFulfillment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StaffRequirementFulfillment.prototype, "updatedAt", void 0);
exports.StaffRequirementFulfillment = StaffRequirementFulfillment = __decorate([
    (0, typeorm_1.Entity)({ name: 'staff_requirement_fulfillment' })
], StaffRequirementFulfillment);
