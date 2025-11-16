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
exports.Room = exports.RoomStatus = exports.RoomType = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("./patient.entity");
var RoomType;
(function (RoomType) {
    RoomType["Consultation"] = "consultation";
    RoomType["Surgery"] = "surgery";
    RoomType["ICU"] = "icu";
    RoomType["Ward"] = "ward";
    RoomType["Lab"] = "lab";
    RoomType["Storage"] = "storage";
})(RoomType || (exports.RoomType = RoomType = {}));
var RoomStatus;
(function (RoomStatus) {
    RoomStatus["Available"] = "available";
    RoomStatus["Occupied"] = "occupied";
    RoomStatus["Maintenance"] = "maintenance";
    RoomStatus["Reserved"] = "reserved";
})(RoomStatus || (exports.RoomStatus = RoomStatus = {}));
let Room = class Room {
};
exports.Room = Room;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Room.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RoomType }),
    __metadata("design:type", String)
], Room.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RoomStatus, default: RoomStatus.Available }),
    __metadata("design:type", String)
], Room.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Room.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'currentPatientId' }),
    __metadata("design:type", Object)
], Room.prototype, "currentPatient", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Room.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Room.prototype, "updatedAt", void 0);
exports.Room = Room = __decorate([
    (0, typeorm_1.Entity)({ name: 'room' })
], Room);
