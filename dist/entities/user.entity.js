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
exports.User = exports.UserType = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
const patient_entity_1 = require("./patient.entity");
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["Receptionist"] = "receptionist";
    UserRole["Pharmacist"] = "pharmacist";
    UserRole["Inventory"] = "inventory";
    UserRole["Doctor"] = "doctor";
    UserRole["Nurse"] = "nurse";
    UserRole["LabTech"] = "lab_tech";
    UserRole["RoomManager"] = "room_manager";
    UserRole["Patient"] = "patient";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserType;
(function (UserType) {
    UserType["Staff"] = "staff";
    UserType["Patient"] = "patient";
})(UserType || (exports.UserType = UserType = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_user_email_unique', { unique: true }),
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_user_phone', { unique: false }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserType, default: UserType.Patient }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => staff_entity_1.Staff, (s) => s.user),
    __metadata("design:type", staff_entity_1.Staff)
], User.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => patient_entity_1.Patient, (p) => p.user),
    __metadata("design:type", patient_entity_1.Patient)
], User.prototype, "patient", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)({ name: 'user' })
], User);
