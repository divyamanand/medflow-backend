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
exports.SpecialtyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const specialty_entity_1 = require("../../entities/specialty.entity");
let SpecialtyService = class SpecialtyService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(data) {
        const { code, name, description } = data;
        if (!code || !name) {
            throw new Error('Code and name are required');
        }
        const existing = await this.repo.findOne({ where: { code } });
        if (existing) {
            throw new Error(`Specialty with code '${code}' already exists`);
        }
        const specialty = this.repo.create({
            code,
            name,
            description: description || null,
        });
        return this.repo.save(specialty);
    }
    async findAll(filter) {
        const qb = this.repo.createQueryBuilder('s');
        if (filter === null || filter === void 0 ? void 0 : filter.search) {
            qb.where('s.name ILIKE :search OR s.code ILIKE :search OR s.description ILIKE :search', {
                search: `%${filter.search}%`,
            });
        }
        qb.orderBy('s.name', 'ASC');
        return qb.getMany();
    }
    async searchByName(keyword) {
        const qb = this.repo.createQueryBuilder('s');
        if (keyword) {
            qb.where('s.name ILIKE :keyword OR s.code ILIKE :keyword', {
                keyword: `%${keyword}%`,
            });
        }
        qb.select(['s.id', 's.name'])
            .orderBy('s.name', 'ASC');
        return qb.getMany();
    }
    async findOne(id) {
        const specialty = await this.repo.findOne({ where: { id } });
        if (!specialty) {
            throw new common_1.NotFoundException(`Specialty with id '${id}' not found`);
        }
        return specialty;
    }
    async findByCode(code) {
        const specialty = await this.repo.findOne({ where: { code } });
        if (!specialty) {
            throw new common_1.NotFoundException(`Specialty with code '${code}' not found`);
        }
        return specialty;
    }
    async update(id, data) {
        const specialty = await this.findOne(id);
        if (data.code && data.code !== specialty.code) {
            const existing = await this.repo.findOne({ where: { code: data.code } });
            if (existing) {
                throw new Error(`Specialty with code '${data.code}' already exists`);
            }
        }
        await this.repo.update({ id }, data);
        return this.findOne(id);
    }
    async remove(id) {
        var _a;
        const specialty = await this.findOne(id);
        const assignmentCount = await this.repo.query('SELECT COUNT(*) as count FROM staff_specialty WHERE "specialtyId" = $1', [id]);
        const count = parseInt(((_a = assignmentCount[0]) === null || _a === void 0 ? void 0 : _a.count) || '0', 10);
        if (count > 0) {
            throw new Error(`Cannot delete specialty. It is assigned to ${count} staff member(s)`);
        }
        await this.repo.delete({ id });
        return { id, removed: true };
    }
    async getStaffBySpecialty(specialtyId) {
        const specialty = await this.findOne(specialtyId);
        const staffList = await this.repo.query(`SELECT s.id, s.notes, ss."primary", u.id as "userId", u."firstName", u."lastName", u.email, u.phone, u.role
       FROM staff_specialty ss
       JOIN staff s ON s.id = ss."staffId"
       LEFT JOIN "user" u ON u.id = s."userId"
       WHERE ss."specialtyId" = $1 AND s."deletedAt" IS NULL
       ORDER BY ss."primary" DESC, u."lastName" ASC, u."firstName" ASC`, [specialtyId]);
        return {
            specialty,
            staff: staffList.map((s) => ({
                id: s.id,
                userId: s.userId,
                name: [s.firstName, s.lastName].filter(Boolean).join(' ') || null,
                email: s.email,
                phone: s.phone,
                role: s.role,
                notes: s.notes,
                primary: s.primary,
            })),
        };
    }
};
exports.SpecialtyService = SpecialtyService;
exports.SpecialtyService = SpecialtyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(specialty_entity_1.Specialty)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SpecialtyService);
