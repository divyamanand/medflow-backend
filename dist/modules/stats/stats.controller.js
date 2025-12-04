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
exports.StatsController = void 0;
const common_1 = require("@nestjs/common");
const stats_service_1 = require("./stats.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let StatsController = class StatsController {
    constructor(svc) {
        this.svc = svc;
    }
    overview() { return this.svc.overview(); }
    todaysAppointments() { return this.svc.todaysAppointments(); }
    last7() { return this.svc.appointmentsLast7Days(); }
    pendingInvites() { return this.svc.pendingInvitations(); }
    lowStock(threshold) { return this.svc.lowStockItems(threshold ? parseInt(threshold, 10) : 10); }
    inventorySummary() { return this.svc.inventorySummary(); }
    occupiedRooms() { return this.svc.occupiedRooms(); }
    staffOnLeave() { return this.svc.staffOnLeaveToday(); }
    recentActivities() { return this.svc.recentActivities(); }
    requirementsSnapshot() { return this.svc.requirementsSnapshot(); }
};
exports.StatsController = StatsController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'inventory', 'pharmacist', 'room_manager'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)('appointments/today'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "todaysAppointments", null);
__decorate([
    (0, common_1.Get)('appointments/last7'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "last7", null);
__decorate([
    (0, common_1.Get)('invitations/pending'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "pendingInvites", null);
__decorate([
    (0, common_1.Get)('inventory/low-stock'),
    (0, roles_decorator_1.Roles)('admin', 'inventory', 'pharmacist'),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "lowStock", null);
__decorate([
    (0, common_1.Get)('inventory/summary'),
    (0, roles_decorator_1.Roles)('admin', 'inventory', 'pharmacist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "inventorySummary", null);
__decorate([
    (0, common_1.Get)('rooms/occupied'),
    (0, roles_decorator_1.Roles)('admin', 'room_manager'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "occupiedRooms", null);
__decorate([
    (0, common_1.Get)('staff/on-leave'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "staffOnLeave", null);
__decorate([
    (0, common_1.Get)('activities/recent'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "recentActivities", null);
__decorate([
    (0, common_1.Get)('requirements/snapshot'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "requirementsSnapshot", null);
exports.StatsController = StatsController = __decorate([
    (0, common_1.Controller)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [stats_service_1.StatsService])
], StatsController);
