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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_entity_1 = require("../../entities/staff.entity");
const timings_entity_1 = require("../../entities/timings.entity");
const leave_entity_1 = require("../../entities/leave.entity");
const user_entity_1 = require("../../entities/user.entity");
const bcrypt = __importStar(require("bcryptjs"));
function withinNow(startTime, endTime, nowMinutes) {
    const [sh, sm] = startTime.split(':').map(v => parseInt(v || '0', 10));
    const [eh, em] = endTime.split(':').map(v => parseInt(v || '0', 10));
    const startM = sh * 60 + sm;
    const endM = eh * 60 + em;
    return nowMinutes >= startM && nowMinutes < endM;
}
let StaffService = class StaffService {
    constructor(repo, timingsRepo, leaveRepo, userRepo) {
        this.repo = repo;
        this.timingsRepo = timingsRepo;
        this.leaveRepo = leaveRepo;
        this.userRepo = userRepo;
    }
    async create(data) {
        const { email, password, role, firstName, lastName, dateOfBirth, gender, phone, notes } = data || {};
        if (!role)
            throw new Error('staff role is required');
        if (email && password) {
            const exists = await this.userRepo.findOne({ where: { email } });
            if (exists)
                throw new Error('Email already in use');
            const passwordHash = await bcrypt.hash(password, 10);
            const user = await this.userRepo.save(this.userRepo.create({
                email,
                passwordHash,
                role,
                type: user_entity_1.UserType.Staff,
                firstName: firstName !== null && firstName !== void 0 ? firstName : null,
                lastName: lastName !== null && lastName !== void 0 ? lastName : null,
                dateOfBirth: dateOfBirth !== null && dateOfBirth !== void 0 ? dateOfBirth : null,
                gender: gender !== null && gender !== void 0 ? gender : null,
                phone: phone !== null && phone !== void 0 ? phone : null,
            }));
            const staff = this.repo.create({ notes: notes !== null && notes !== void 0 ? notes : null, user: { id: user.id } });
            return this.repo.save(staff);
        }
        const staff = this.repo.create({ notes: notes !== null && notes !== void 0 ? notes : null });
        return this.repo.save(staff);
    }
    async findAll(filter) {
        let rows = await this.repo.find({ relations: ['user'] });
        if (!filter)
            return rows;
        if (filter.role)
            rows = rows.filter(r => { var _a; return ((_a = r.user) === null || _a === void 0 ? void 0 : _a.role) === filter.role; });
        if (filter.specialtyId) {
            const specStaffIds = await this.repo.query('SELECT staffId FROM staff_specialty WHERE specialtyId = $1', [filter.specialtyId]);
            const allowedIds = new Set(specStaffIds.map((r) => r.staffid || r.staffId));
            rows = rows.filter(r => allowedIds.has(r.id));
        }
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);
        if (filter.onLeave || filter.isAvailable) {
            const staffIds = rows.map(r => r.id);
            if (staffIds.length) {
                const leaves = await this.leaveRepo.createQueryBuilder('l')
                    .where('l.staffId IN (:...ids)', { ids: staffIds })
                    .andWhere('l.status = :st', { st: 'approved' })
                    .andWhere(':today BETWEEN l.startDate AND l.endDate', { today: todayStr })
                    .getMany();
                const leaveSet = new Set(leaves.map(l => l.staff.id));
                const timings = await this.timingsRepo.createQueryBuilder('t')
                    .where('t.staffId IN (:...ids)', { ids: staffIds })
                    .andWhere('t.isAvailable = true')
                    .getMany();
                const weekday = today.getDay();
                const nowMinutes = today.getHours() * 60 + today.getMinutes();
                const availSet = new Set(timings.filter(t => t.weekday === weekday && withinNow(t.startTime, t.endTime, nowMinutes)).map(t => t.staff.id));
                if (filter.onLeave)
                    rows = rows.filter(r => leaveSet.has(r.id));
                if (filter.isAvailable)
                    rows = rows.filter(r => availSet.has(r.id) && !leaveSet.has(r.id));
            }
        }
        return rows;
    }
    findOne(id) { return this.repo.findOne({ where: { id }, relations: ['user'] }); }
    async update(id, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const staffUpdates = {};
        if (typeof data.notes !== 'undefined')
            staffUpdates.notes = data.notes;
        if (Object.keys(staffUpdates).length)
            await this.repo.update({ id }, staffUpdates);
        if (data.firstName || data.lastName || data.phone || data.gender || data.dateOfBirth) {
            const staff = await this.repo.findOne({ where: { id }, relations: ['user'] });
            if ((_a = staff === null || staff === void 0 ? void 0 : staff.user) === null || _a === void 0 ? void 0 : _a.id) {
                await this.userRepo.update({ id: staff.user.id }, {
                    firstName: (_c = (_b = data.firstName) !== null && _b !== void 0 ? _b : staff.user.firstName) !== null && _c !== void 0 ? _c : null,
                    lastName: (_e = (_d = data.lastName) !== null && _d !== void 0 ? _d : staff.user.lastName) !== null && _e !== void 0 ? _e : null,
                    phone: (_g = (_f = data.phone) !== null && _f !== void 0 ? _f : staff.user.phone) !== null && _g !== void 0 ? _g : null,
                    gender: (_j = (_h = data.gender) !== null && _h !== void 0 ? _h : staff.user.gender) !== null && _j !== void 0 ? _j : null,
                    dateOfBirth: (_l = (_k = data.dateOfBirth) !== null && _k !== void 0 ? _k : staff.user.dateOfBirth) !== null && _l !== void 0 ? _l : null,
                });
            }
        }
        return this.findOne(id);
    }
    async loadSpecialtiesMap(staffIds) {
        if (!staffIds.length)
            return new Map();
        const raw = await this.repo.query(`SELECT ss."staffId" as staffId, sp.id as specId, sp.name as specName, ss.primary as primary
       FROM staff_specialty ss
       JOIN specialty sp ON sp.id = ss."specialtyId"
       WHERE ss."staffId" = ANY($1::uuid[])`, [staffIds]);
        const map = new Map();
        for (const r of raw) {
            const sid = r.staffid || r.staffId;
            if (!map.has(sid))
                map.set(sid, []);
            map.get(sid).push({ id: r.specid || r.specId, name: r.specname || r.specName, primary: !!r.primary });
        }
        return map;
    }
    async findAllDetailed(filter) {
        const rows = await this.findAll(filter);
        const ids = rows.map((r) => r.id);
        const specMap = await this.loadSpecialtiesMap(ids);
        return rows.map((s) => {
            var _a, _b, _c, _d, _e;
            const firstName = ((_a = s.user) === null || _a === void 0 ? void 0 : _a.firstName) || '';
            const lastName = ((_b = s.user) === null || _b === void 0 ? void 0 : _b.lastName) || '';
            const name = [firstName, lastName].join(' ').trim() || null;
            return {
                id: s.id,
                name,
                role: ((_c = s.user) === null || _c === void 0 ? void 0 : _c.role) || null,
                phone: ((_d = s.user) === null || _d === void 0 ? void 0 : _d.phone) || null,
                email: ((_e = s.user) === null || _e === void 0 ? void 0 : _e.email) || null,
                notes: s.notes || null,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
                specialties: (specMap.get(s.id) || []).sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0)),
            };
        });
    }
    async findOneDetailed(id) {
        var _a, _b, _c, _d, _e;
        const s = await this.findOne(id);
        if (!s)
            return null;
        const specMap = await this.loadSpecialtiesMap([s.id]);
        const firstName = ((_a = s.user) === null || _a === void 0 ? void 0 : _a.firstName) || '';
        const lastName = ((_b = s.user) === null || _b === void 0 ? void 0 : _b.lastName) || '';
        const name = [firstName, lastName].join(' ').trim() || null;
        return {
            id: s.id,
            name,
            role: ((_c = s.user) === null || _c === void 0 ? void 0 : _c.role) || null,
            phone: ((_d = s.user) === null || _d === void 0 ? void 0 : _d.phone) || null,
            email: ((_e = s.user) === null || _e === void 0 ? void 0 : _e.email) || null,
            notes: s.notes || null,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
            specialties: (specMap.get(s.id) || []).sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0)),
        };
    }
    getTimings(staffId) { return this.timingsRepo.find({ where: { staff: { id: staffId } } }); }
    async upsertTimings(staffId, entries) {
        await this.timingsRepo.delete({ staff: { id: staffId } });
        const toSave = entries.map((e) => this.timingsRepo.create({ ...e, staff: { id: staffId } }));
        return this.timingsRepo.save(toSave);
    }
    addLeave(staffId, leave) {
        return this.leaveRepo.save(this.leaveRepo.create({ ...leave, staff: { id: staffId } }));
    }
    createTiming(staffId, timing) {
        return this.timingsRepo.save(this.timingsRepo.create({ ...timing, staff: { id: staffId } }));
    }
    getTimingById(staffId, timingId) {
        return this.timingsRepo.findOne({ where: { id: timingId, staff: { id: staffId } } });
    }
    async updateTiming(staffId, timingId, data) {
        await this.timingsRepo.createQueryBuilder()
            .update(timings_entity_1.Timings)
            .set(data)
            .where('id = :id AND staffId = :sid', { id: timingId, sid: staffId })
            .execute();
        return this.getTimingById(staffId, timingId);
    }
    async deleteTiming(staffId, timingId) {
        await this.timingsRepo.createQueryBuilder()
            .delete()
            .from(timings_entity_1.Timings)
            .where('id = :id AND staffId = :sid', { id: timingId, sid: staffId })
            .execute();
        return { id: timingId, removed: true };
    }
    listLeaves(staffId) {
        return this.leaveRepo.find({ where: { staff: { id: staffId } } });
    }
    getLeaveById(staffId, leaveId) {
        return this.leaveRepo.findOne({ where: { id: leaveId, staff: { id: staffId } } });
    }
    async updateLeave(staffId, leaveId, data) {
        await this.leaveRepo.createQueryBuilder()
            .update(leave_entity_1.Leave)
            .set(data)
            .where('id = :id AND staffId = :sid', { id: leaveId, sid: staffId })
            .execute();
        return this.getLeaveById(staffId, leaveId);
    }
    async deleteLeave(staffId, leaveId) {
        await this.leaveRepo.createQueryBuilder()
            .delete()
            .from(leave_entity_1.Leave)
            .where('id = :id AND staffId = :sid', { id: leaveId, sid: staffId })
            .execute();
        return { id: leaveId, removed: true };
    }
    async getTimingsTable(filter) {
        var _a, _b, _c, _d, _e;
        const staffRows = await this.findAll({ role: filter === null || filter === void 0 ? void 0 : filter.role, specialtyId: filter === null || filter === void 0 ? void 0 : filter.specialtyId });
        const staffIds = staffRows.map((s) => s.id);
        if (!staffIds.length)
            return [];
        const tQ = this.timingsRepo.createQueryBuilder('t').where('t.staffId IN (:...ids)', { ids: staffIds });
        if (typeof (filter === null || filter === void 0 ? void 0 : filter.weekday) === 'number')
            tQ.andWhere('t.weekday = :wd', { wd: filter.weekday });
        const timings = await tQ.getMany();
        const lQ = this.leaveRepo.createQueryBuilder('l').where('l.staffId IN (:...ids)', { ids: staffIds });
        const from = filter === null || filter === void 0 ? void 0 : filter.from;
        const to = filter === null || filter === void 0 ? void 0 : filter.to;
        if (from && to) {
            lQ.andWhere('l.startDate <= :to AND l.endDate >= :from', { from, to });
        }
        else if (from) {
            lQ.andWhere('l.endDate >= :from', { from });
        }
        else if (to) {
            lQ.andWhere('l.startDate <= :to', { to });
        }
        const leaves = await lQ.getMany();
        const byStaff = {};
        for (const s of staffRows) {
            const name = [((_a = s.user) === null || _a === void 0 ? void 0 : _a.firstName) || '', ((_b = s.user) === null || _b === void 0 ? void 0 : _b.lastName) || ''].join(' ').trim() || null;
            const role = ((_c = s.user) === null || _c === void 0 ? void 0 : _c.role) || null;
            byStaff[s.id] = { staffId: s.id, name, role, timings: [], leaves: [] };
        }
        for (const t of timings) {
            const sid = ((_d = t.staff) === null || _d === void 0 ? void 0 : _d.id) || t.staffId;
            if (!byStaff[sid])
                continue;
            byStaff[sid].timings.push({ id: t.id, weekday: t.weekday, startTime: t.startTime, endTime: t.endTime, isAvailable: t.isAvailable, notes: t.notes });
        }
        for (const l of leaves) {
            const sid = ((_e = l.staff) === null || _e === void 0 ? void 0 : _e.id) || l.staffId;
            if (!byStaff[sid])
                continue;
            byStaff[sid].leaves.push({ id: l.id, startDate: l.startDate, endDate: l.endDate, status: l.status, reason: l.reason, notes: l.notes });
        }
        return Object.values(byStaff);
    }
    async getLeavesTable(filter) {
        var _a, _b, _c;
        const staffRows = await this.findAll({ role: filter === null || filter === void 0 ? void 0 : filter.role, specialtyId: filter === null || filter === void 0 ? void 0 : filter.specialtyId });
        const staffIds = staffRows.map((s) => s.id);
        if (!staffIds.length)
            return [];
        const lQ = this.leaveRepo.createQueryBuilder('l').leftJoinAndSelect('l.staff', 'staff').where('l.staffId IN (:...ids)', { ids: staffIds });
        if (filter === null || filter === void 0 ? void 0 : filter.status)
            lQ.andWhere('l.status = :st', { st: filter.status });
        const from = filter === null || filter === void 0 ? void 0 : filter.from;
        const to = filter === null || filter === void 0 ? void 0 : filter.to;
        if (from && to) {
            lQ.andWhere('l.startDate <= :to AND l.endDate >= :from', { from, to });
        }
        else if (from) {
            lQ.andWhere('l.endDate >= :from', { from });
        }
        else if (to) {
            lQ.andWhere('l.startDate <= :to', { to });
        }
        const leaves = await lQ.getMany();
        const userByStaff = {};
        for (const s of staffRows) {
            const name = [((_a = s.user) === null || _a === void 0 ? void 0 : _a.firstName) || '', ((_b = s.user) === null || _b === void 0 ? void 0 : _b.lastName) || ''].join(' ').trim() || null;
            userByStaff[s.id] = { name, role: ((_c = s.user) === null || _c === void 0 ? void 0 : _c.role) || null };
        }
        return leaves.map((l) => {
            var _a;
            const sid = ((_a = l.staff) === null || _a === void 0 ? void 0 : _a.id) || l.staffId;
            const meta = userByStaff[sid] || { name: null, role: null };
            return {
                leaveId: l.id,
                staffId: sid,
                staffName: meta.name,
                role: meta.role,
                startDate: l.startDate,
                endDate: l.endDate,
                status: l.status,
                reason: l.reason,
                notes: l.notes,
                createdAt: l.createdAt,
                updatedAt: l.updatedAt,
            };
        });
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(1, (0, typeorm_1.InjectRepository)(timings_entity_1.Timings)),
    __param(2, (0, typeorm_1.InjectRepository)(leave_entity_1.Leave)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StaffService);
