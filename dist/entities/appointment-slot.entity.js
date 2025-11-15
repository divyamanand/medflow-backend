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
exports.AppointmentSlot = exports.SlotSource = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
const appointment_entity_1 = require("./appointment.entity");
var SlotSource;
(function (SlotSource) {
    SlotSource["Timings"] = "timings";
    SlotSource["AdminBlock"] = "admin_block";
    SlotSource["SystemGenerated"] = "system_generated";
})(SlotSource || (exports.SlotSource = SlotSource = {}));
let AppointmentSlot = class AppointmentSlot {
};
exports.AppointmentSlot = AppointmentSlot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AppointmentSlot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'doctor_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], AppointmentSlot.prototype, "doctor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], AppointmentSlot.prototype, "slotStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], AppointmentSlot.prototype, "slotEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AppointmentSlot.prototype, "isBooked", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => appointment_entity_1.Appointment, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'appointment_id' }),
    __metadata("design:type", Object)
], AppointmentSlot.prototype, "appointment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SlotSource }),
    __metadata("design:type", String)
], AppointmentSlot.prototype, "source", void 0);
exports.AppointmentSlot = AppointmentSlot = __decorate([
    (0, typeorm_1.Entity)({ name: 'appointment_slot' })
], AppointmentSlot);
