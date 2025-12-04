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
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_entity_1 = require("../../entities/activity.entity");
let ActivityService = class ActivityService {
    constructor(repo) {
        this.repo = repo;
    }
    async log(userId, action, ip, meta) {
        const entry = this.repo.create({ userId: userId !== null && userId !== void 0 ? userId : null, action, ip: ip !== null && ip !== void 0 ? ip : null, meta: meta !== null && meta !== void 0 ? meta : null });
        return this.repo.save(entry);
    }
    async list(filter) {
        const qb = this.repo.createQueryBuilder('a');
        if (filter === null || filter === void 0 ? void 0 : filter.userId)
            qb.andWhere('a.userId = :uid', { uid: filter.userId });
        if (filter === null || filter === void 0 ? void 0 : filter.action)
            qb.andWhere('a.action ILIKE :act', { act: `%${filter.action}%` });
        qb.orderBy('a.createdAt', 'DESC');
        if (filter === null || filter === void 0 ? void 0 : filter.limit)
            qb.limit(filter.limit);
        return qb.getMany();
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ActivityService);
