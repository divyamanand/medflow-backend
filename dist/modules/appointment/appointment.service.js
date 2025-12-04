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
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("../../entities/appointment.entity");
const staff_entity_1 = require("../../entities/staff.entity");
const timings_entity_1 = require("../../entities/timings.entity");
const leave_entity_1 = require("../../entities/leave.entity");
const specialty_entity_1 = require("../../entities/specialty.entity");
const llm_service_1 = require("../llm/llm.service");
let AppointmentService = class AppointmentService {
    constructor(repo, staffRepo, timingsRepo, leaveRepo, specialtyRepo, llmService) {
        this.repo = repo;
        this.staffRepo = staffRepo;
        this.timingsRepo = timingsRepo;
        this.leaveRepo = leaveRepo;
        this.specialtyRepo = specialtyRepo;
        this.llmService = llmService;
    }
    create(data) { return this.repo.save(this.repo.create(data)); }
    findAll(filter) {
        const qb = this.repo
            .createQueryBuilder('a')
            .leftJoinAndSelect('a.patient', 'patient')
            .leftJoinAndSelect('patient.user', 'puser')
            .leftJoinAndSelect('a.doctor', 'doctor')
            .leftJoinAndSelect('doctor.user', 'duser');
        qb.where('1=1');
        if (filter === null || filter === void 0 ? void 0 : filter.patientId)
            qb.andWhere('a.patientId = :pid', { pid: filter.patientId });
        if (filter === null || filter === void 0 ? void 0 : filter.doctorId)
            qb.andWhere('a.doctorId = :did', { did: filter.doctorId });
        if (filter === null || filter === void 0 ? void 0 : filter.status)
            qb.andWhere('a.status = :st', { st: filter.status });
        if (filter === null || filter === void 0 ? void 0 : filter.from)
            qb.andWhere('a.startAt >= :from', { from: filter.from });
        if (filter === null || filter === void 0 ? void 0 : filter.to)
            qb.andWhere('a.startAt <= :to', { to: filter.to });
        return qb.getMany();
    }
    findOne(id) { return this.repo.findOne({ where: { id }, relations: ['patient', 'patient.user', 'doctor', 'doctor.user'] }); }
    async findMatchingDoctorsForIssues(payload) {
        const issues = Array.isArray(payload === null || payload === void 0 ? void 0 : payload.issues) ? payload.issues : [];
        const specIds = Array.isArray(payload === null || payload === void 0 ? void 0 : payload.specialty_ids) ? payload.specialty_ids : [];
        if (!issues.length && !specIds.length)
            return [];
        let specialties = [];
        if (specIds.length) {
            specialties = await this.specialtyRepo
                .createQueryBuilder('s')
                .where('s.id IN (:...ids)', { ids: specIds })
                .getMany();
        }
        else {
            specialties = await this.specialtyRepo.createQueryBuilder('s').select(['s.id', 's.name']).getMany();
        }
        const inferred = await this.llmService.inferSpecialties(issues, specialties);
        if (!inferred || !inferred.length)
            return [];
        const rows = await this.repo.query(`SELECT s.id as "doctorId", json_agg(json_build_object('id', sp.id, 'name', sp.name) ORDER BY ss."primary" DESC) as specialties
       FROM staff s
       JOIN staff_specialty ss ON ss."staffId" = s.id
       JOIN specialty sp ON sp.id = ss."specialtyId"
       LEFT JOIN "user" u ON u.id = s."userId"
       WHERE u.role = 'doctor'
       GROUP BY s.id`, []);
        const lowerInferred = inferred.map((x) => x.toLowerCase());
        const results = [];
        for (const r of rows) {
            const specs = r.specialties || [];
            const names = specs.map((s) => (s.name || '').toLowerCase());
            const matched = lowerInferred.filter((inf) => names.includes(inf));
            const score = lowerInferred.length ? matched.length / lowerInferred.length : 0;
            if (score > 0)
                results.push({ doctorId: r.doctorId, score, specialties: specs });
        }
        return results.sort((a, b) => b.score - a.score).map((x) => ({ doctorId: x.doctorId, score: x.score, specialties: x.specialties }));
    }
    async getDoctorNext3Slots(doctorId, dateFilter) {
        const targetCount = 3;
        const results = [];
        const now = new Date();
        let targetDate = null;
        let searchSingleDay = false;
        if (dateFilter) {
            targetDate = new Date(dateFilter);
            targetDate.setHours(0, 0, 0, 0);
            searchSingleDay = true;
        }
        const timings = await this.timingsRepo.find({ where: { staff: { id: doctorId }, isAvailable: true } });
        if (!timings.length)
            return results;
        const maxDays = searchSingleDay ? 1 : 30;
        let dayCursor = 0;
        while (results.length < targetCount && dayCursor < maxDays) {
            const date = targetDate ? new Date(targetDate) : new Date(now);
            date.setHours(0, 0, 0, 0);
            if (!targetDate) {
                date.setDate(now.getDate() + dayCursor);
            }
            const weekday = date.getDay();
            const dayTimings = timings.filter((t) => t.weekday === weekday);
            for (const t of dayTimings) {
                const slotDuration = 15;
                const dayStart = this.combineDateTime(date, t.startTime);
                const dayEnd = this.combineDateTime(date, t.endTime);
                let slotStart = new Date(Math.max(dayStart.getTime(), searchSingleDay ? dayStart.getTime() : now.getTime()));
                if (searchSingleDay && date.toDateString() === now.toDateString()) {
                    slotStart = new Date(Math.max(dayStart.getTime(), now.getTime()));
                }
                slotStart = this.alignToSlot(slotStart, dayStart, slotDuration);
                while (slotStart < dayEnd && results.length < targetCount) {
                    const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);
                    if (slotEnd > dayEnd)
                        break;
                    const available = await this.isSlotAvailable(doctorId, slotStart, slotEnd);
                    if (available) {
                        results.push({ startDatetime: new Date(slotStart), endDatetime: new Date(slotEnd), slotDurationMinutes: slotDuration });
                    }
                    slotStart = new Date(slotStart.getTime() + slotDuration * 60000);
                }
                if (results.length >= targetCount)
                    break;
            }
            dayCursor += 1;
        }
        return results;
    }
    combineDateTime(date, timeStr) {
        const [h, m, s] = timeStr.split(':').map((v) => parseInt(v || '0', 10));
        const d = new Date(date);
        d.setHours(h || 0, m || 0, s || 0, 0);
        return d;
    }
    alignToSlot(current, dayStart, minutes) {
        const offset = current.getTime() - dayStart.getTime();
        const step = minutes * 60000;
        const aligned = Math.ceil(offset / step) * step + dayStart.getTime();
        return new Date(aligned);
    }
    async isSlotAvailable(doctorId, start, end) {
        const leaveOverlap = await this.leaveRepo.createQueryBuilder('l')
            .where('l.staffId = :did', { did: doctorId })
            .andWhere('l.startDate <= :endDate', { endDate: end.toISOString().slice(0, 10) })
            .andWhere('l.endDate >= :startDate', { startDate: start.toISOString().slice(0, 10) })
            .getCount();
        if (leaveOverlap > 0)
            return false;
        const busyStatuses = ['scheduled', 'confirmed', 'checkedIn', 'completed'];
        const apptOverlap = await this.repo.createQueryBuilder('a')
            .where('a.doctorId = :did', { did: doctorId })
            .andWhere('a.status IN (:...st)', { st: busyStatuses })
            .andWhere('a.startAt < :end', { end })
            .andWhere('a.endAt > :start', { start })
            .getCount();
        return apptOverlap === 0;
    }
    async book(data) {
        var _a;
        if (!(data === null || data === void 0 ? void 0 : data.doctor) || !(data === null || data === void 0 ? void 0 : data.patient) || !(data === null || data === void 0 ? void 0 : data.startAt) || !(data === null || data === void 0 ? void 0 : data.endAt)) {
            throw new Error('Missing required fields: doctor, patient, startAt, endAt');
        }
        const doctorId = ((_a = data.doctor) === null || _a === void 0 ? void 0 : _a.id) || (data === null || data === void 0 ? void 0 : data.doctorId);
        const start = new Date(data.startAt);
        const end = new Date(data.endAt);
        const available = await this.isSlotAvailable(doctorId, start, end);
        if (!available) {
            throw new Error('Selected slot is no longer available');
        }
        let issuesText = null;
        const rawIssues = data.issues;
        if (Array.isArray(rawIssues))
            issuesText = rawIssues.map((v) => (v || '').trim()).filter(v => v.length).join(', ');
        else if (typeof rawIssues === 'string')
            issuesText = rawIssues.trim().length ? rawIssues.trim() : null;
        return this.create({ ...data, issues: issuesText, status: 'confirmed' });
    }
    async update(id, data) {
        const patch = { ...data };
        if (typeof data.issues !== 'undefined') {
            const raw = data.issues;
            if (Array.isArray(raw))
                patch.issues = raw.map((v) => (v || '').trim()).filter(v => v.length).join(', ');
            else if (typeof raw === 'string')
                patch.issues = raw.trim().length ? raw.trim() : null;
            else
                patch.issues = null;
        }
        await this.repo.update({ id }, patch);
        return this.findOne(id);
    }
    async cancel(id, reason) {
        await this.repo.update({ id }, { status: 'cancelled', cancelReason: reason !== null && reason !== void 0 ? reason : null });
        return { id, status: 'cancelled', cancelReason: reason !== null && reason !== void 0 ? reason : null };
    }
    async remove(id) {
        await this.repo.delete({ id });
        return { id, removed: true };
    }
    async transition(id, action) {
        const statusMap = {
            confirm: 'confirmed',
            checkin: 'checkedIn',
            complete: 'completed',
        };
        const next = statusMap[action];
        await this.repo.update({ id }, { status: next });
        return this.findOne(id);
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(2, (0, typeorm_1.InjectRepository)(timings_entity_1.Timings)),
    __param(3, (0, typeorm_1.InjectRepository)(leave_entity_1.Leave)),
    __param(4, (0, typeorm_1.InjectRepository)(specialty_entity_1.Specialty)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        llm_service_1.LlmService])
], AppointmentService);
