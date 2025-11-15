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
exports.PatientService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("../../entities/patient.entity");
const user_entity_1 = require("../../entities/user.entity");
const appointment_entity_1 = require("../../entities/appointment.entity");
const prescription_entity_1 = require("../../entities/prescription.entity");
const bcrypt = __importStar(require("bcryptjs"));
function calcAgeYears(dob) {
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const mDiff = now.getMonth() - dob.getMonth();
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < dob.getDate()))
        age--;
    return age;
}
let PatientService = class PatientService {
    constructor(repo, userRepo, apptRepo, presRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.apptRepo = apptRepo;
        this.presRepo = presRepo;
    }
    async create(data) {
        const { email, password, firstName, lastName, dateOfBirth, gender, phone, primaryPhysicianId } = data || {};
        if (email && password) {
            const exists = await this.userRepo.findOne({ where: { email } });
            if (exists)
                throw new Error('Email already in use');
            const passwordHash = await bcrypt.hash(password, 10);
            const user = await this.userRepo.save(this.userRepo.create({
                email,
                passwordHash,
                role: user_entity_1.UserRole.Patient,
                type: user_entity_1.UserType.Patient,
                firstName: firstName !== null && firstName !== void 0 ? firstName : null,
                lastName: lastName !== null && lastName !== void 0 ? lastName : null,
                dateOfBirth: dateOfBirth !== null && dateOfBirth !== void 0 ? dateOfBirth : null,
                gender: gender !== null && gender !== void 0 ? gender : null,
                phone: phone !== null && phone !== void 0 ? phone : null,
            }));
            const patient = this.repo.create({ user: { id: user.id }, primaryPhysician: primaryPhysicianId ? { id: primaryPhysicianId } : null });
            return this.repo.save(patient);
        }
        const patient = this.repo.create({ primaryPhysician: primaryPhysicianId ? { id: primaryPhysicianId } : null });
        return this.repo.save(patient);
    }
    async findAll(filter) {
        let rows = await this.repo.find({ relations: ['user', 'primaryPhysician'] });
        if (!filter)
            return rows;
        if (filter.gender)
            rows = rows.filter(r => { var _a; return ((_a = r.user) === null || _a === void 0 ? void 0 : _a.gender) === filter.gender; });
        if (filter.minAge || filter.maxAge) {
            rows = rows.filter(r => {
                var _a;
                const dob = ((_a = r.user) === null || _a === void 0 ? void 0 : _a.dateOfBirth) ? new Date(r.user.dateOfBirth) : null;
                if (!dob)
                    return false;
                const age = calcAgeYears(dob);
                if (filter.minAge && age < filter.minAge)
                    return false;
                if (filter.maxAge && age > filter.maxAge)
                    return false;
                return true;
            });
        }
        return rows;
    }
    async findAllSummaries(filter) {
        const rows = await this.findAll(filter);
        if (!rows.length)
            return [];
        const ids = rows.map((r) => r.id);
        const apptCountsRaw = await this.apptRepo.createQueryBuilder('a')
            .select('a.patientId', 'patientId')
            .addSelect('COUNT(*)', 'count')
            .where('a.patientId IN (:...ids)', { ids })
            .groupBy('a.patientId')
            .getRawMany();
        const presCountsRaw = await this.presRepo.createQueryBuilder('p')
            .select('p.patientId', 'patientId')
            .addSelect('COUNT(*)', 'count')
            .where('p.patientId IN (:...ids)', { ids })
            .groupBy('p.patientId')
            .getRawMany();
        const apptMap = new Map(apptCountsRaw.map((r) => [r.patientId, parseInt(r.count, 10)]));
        const presMap = new Map(presCountsRaw.map((r) => [r.patientId, parseInt(r.count, 10)]));
        return rows.map((r) => {
            var _a, _b, _c, _d, _e;
            const firstName = ((_a = r.user) === null || _a === void 0 ? void 0 : _a.firstName) || '';
            const lastName = ((_b = r.user) === null || _b === void 0 ? void 0 : _b.lastName) || '';
            const name = [firstName, lastName].join(' ').trim() || null;
            const dob = ((_c = r.user) === null || _c === void 0 ? void 0 : _c.dateOfBirth) ? new Date(r.user.dateOfBirth) : null;
            const age = dob ? calcAgeYears(dob) : null;
            const gender = ((_d = r.user) === null || _d === void 0 ? void 0 : _d.gender) || null;
            return {
                id: r.id,
                name,
                dateOfBirth: ((_e = r.user) === null || _e === void 0 ? void 0 : _e.dateOfBirth) || null,
                gender,
                age,
                createdAt: r.createdAt,
                appointmentsCount: apptMap.get(r.id) || 0,
                prescriptionsCount: presMap.get(r.id) || 0,
            };
        });
    }
    findOne(id) { return this.repo.findOne({ where: { id }, relations: ['user', 'primaryPhysician'] }); }
    async update(id, data) {
        await this.repo.update({ id }, data);
        return this.findOne(id);
    }
    async getDoctorsFromPrescriptions(patientId) {
        const rows = await this.repo.query(`SELECT DISTINCT p.doctorId as "doctorId" FROM prescription p WHERE p.patientId = $1 AND p.doctorId IS NOT NULL`, [patientId]);
        return rows.map((r) => r.doctorId);
    }
    async isDoctorLinkedToPatient(doctorId, patientId) {
        if (!doctorId || !patientId)
            return false;
        const appt = await this.repo.query('SELECT 1 FROM appointment WHERE patientId = $1 AND doctorId = $2 LIMIT 1', [patientId, doctorId]);
        if (appt.length > 0)
            return true;
        const rx = await this.repo.query('SELECT 1 FROM prescription WHERE patientId = $1 AND doctorId = $2 LIMIT 1', [patientId, doctorId]);
        return rx.length > 0;
    }
    async getAppointmentsForPatient(patientId) {
        const qb = this.apptRepo
            .createQueryBuilder('a')
            .leftJoinAndSelect('a.patient', 'patient')
            .leftJoinAndSelect('a.doctor', 'doctor')
            .where('a.patientId = :pid', { pid: patientId })
            .orderBy('a.startAt', 'DESC');
        return qb.getMany();
    }
    async getPrescriptionsForPatient(patientId) {
        const qb = this.presRepo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.patient', 'patient')
            .leftJoinAndSelect('p.doctor', 'doctor')
            .leftJoinAndSelect('p.items', 'items')
            .where('p.patientId = :pid', { pid: patientId })
            .orderBy('p.createdAt', 'DESC');
        return qb.getMany();
    }
};
exports.PatientService = PatientService;
exports.PatientService = PatientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __param(3, (0, typeorm_1.InjectRepository)(prescription_entity_1.Prescription)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PatientService);
