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
exports.StaffSpecialty = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
const specialty_entity_1 = require("./specialty.entity");
let StaffSpecialty = class StaffSpecialty {
};
exports.StaffSpecialty = StaffSpecialty;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StaffSpecialty.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, (s) => s.staffSpecialties, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'staffId' }),
    __metadata("design:type", staff_entity_1.Staff)
], StaffSpecialty.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => specialty_entity_1.Specialty, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'specialtyId' }),
    __metadata("design:type", specialty_entity_1.Specialty)
], StaffSpecialty.prototype, "specialty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], StaffSpecialty.prototype, "primary", void 0);
exports.StaffSpecialty = StaffSpecialty = __decorate([
    (0, typeorm_1.Entity)({ name: 'staff_specialty' }),
    (0, typeorm_1.Unique)('uq_staff_specialty_pair', ['staff', 'specialty'])
], StaffSpecialty);
