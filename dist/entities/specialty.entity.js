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
exports.Specialty = void 0;
const typeorm_1 = require("typeorm");
const staff_specialty_entity_1 = require("./staff-specialty.entity");
let Specialty = class Specialty {
};
exports.Specialty = Specialty;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Specialty.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_specialty_code', { unique: true }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Specialty.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Specialty.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Specialty.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Specialty.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Specialty.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => staff_specialty_entity_1.StaffSpecialty, (ss) => ss.specialty),
    __metadata("design:type", Array)
], Specialty.prototype, "staffSpecialties", void 0);
exports.Specialty = Specialty = __decorate([
    (0, typeorm_1.Entity)({ name: 'specialty' })
], Specialty);
