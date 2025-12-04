"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const bcrypt = __importStar(require("bcryptjs"));
let UserService = class UserService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(data) {
        const { email, password, role, firstName, lastName, gender, dateOfBirth, phone, type } = data || {};
        if (!email || !password || !role)
            throw new common_1.BadRequestException('email, password, role required');
        const exists = await this.repo.findOne({ where: { email } });
        if (exists)
            throw new common_1.BadRequestException('Email already in use');
        const passwordHash = await bcrypt.hash(password, 10);
        const userType = type || (role === user_entity_1.UserRole.Patient ? user_entity_1.UserType.Patient : user_entity_1.UserType.Staff);
        const ent = this.repo.create({ email, passwordHash, role, type: userType, firstName: firstName !== null && firstName !== void 0 ? firstName : null, lastName: lastName !== null && lastName !== void 0 ? lastName : null, gender: gender !== null && gender !== void 0 ? gender : null, dateOfBirth: dateOfBirth !== null && dateOfBirth !== void 0 ? dateOfBirth : null, phone: phone !== null && phone !== void 0 ? phone : null });
        return this.repo.save(ent);
    }
    async findAll(filter) {
        const qb = this.repo.createQueryBuilder('u');
        qb.where('1=1');
        if (filter === null || filter === void 0 ? void 0 : filter.role)
            qb.andWhere('u.role = :role', { role: filter.role });
        if (filter === null || filter === void 0 ? void 0 : filter.type)
            qb.andWhere('u.type = :type', { type: filter.type });
        if (filter === null || filter === void 0 ? void 0 : filter.emailLike)
            qb.andWhere('LOWER(u.email) LIKE LOWER(:em)', { em: `%${filter.emailLike}%` });
        if (filter === null || filter === void 0 ? void 0 : filter.gender)
            qb.andWhere('u.gender = :g', { g: filter.gender });
        if ((filter === null || filter === void 0 ? void 0 : filter.minAge) || (filter === null || filter === void 0 ? void 0 : filter.maxAge)) {
            const now = new Date();
            if (filter.minAge) {
                const maxDob = new Date(now);
                maxDob.setFullYear(now.getFullYear() - filter.minAge);
                qb.andWhere('u.dateOfBirth <= :maxDob', { maxDob: maxDob.toISOString().slice(0, 10) });
            }
            if (filter.maxAge) {
                const minDob = new Date(now);
                minDob.setFullYear(now.getFullYear() - filter.maxAge - 1);
                qb.andWhere('u.dateOfBirth >= :minDob', { minDob: minDob.toISOString().slice(0, 10) });
            }
        }
        return qb.getMany();
    }
    findOne(id) { return this.repo.findOne({ where: { id } }); }
    async update(id, data) {
        const updates = { ...data };
        if (data.password) {
            updates.passwordHash = await bcrypt.hash(data.password, 10);
            delete updates.password;
        }
        await this.repo.update({ id }, updates);
        return this.findOne(id);
    }
    async remove(id) {
        await this.repo.delete({ id });
        return { id, removed: true };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
