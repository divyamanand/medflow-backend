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
exports.IssueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const issue_entity_1 = require("../../entities/issue.entity");
let IssueService = class IssueService {
    constructor(issueRepo) {
        this.issueRepo = issueRepo;
    }
    create(data) { return this.issueRepo.save(this.issueRepo.create(data)); }
    findAll() { return this.issueRepo.find({ relations: ['mappedSpecialty'] }); }
    async getMappedDoctors(issueId) {
        const issue = await this.issueRepo.findOne({ where: { id: issueId }, relations: ['mappedSpecialty'] });
        if (!(issue === null || issue === void 0 ? void 0 : issue.mappedSpecialty))
            return [];
        const rows = await this.issueRepo.query(`SELECT ss.staff_id as "staffId"
       FROM staff_specialty ss
       JOIN staff s ON s.id = ss.staff_id
       WHERE ss.specialty_id = $1 AND s.role = 'doctor' AND s.status = 'active'
       ORDER BY ss.primary DESC`, [issue.mappedSpecialty.id]);
        return rows.map((r) => r.staffId);
    }
};
exports.IssueService = IssueService;
exports.IssueService = IssueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(issue_entity_1.Issue)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IssueService);
