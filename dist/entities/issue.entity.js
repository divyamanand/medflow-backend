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
exports.Issue = exports.IssueSeverity = void 0;
const typeorm_1 = require("typeorm");
const specialty_entity_1 = require("./specialty.entity");
var IssueSeverity;
(function (IssueSeverity) {
    IssueSeverity["Low"] = "low";
    IssueSeverity["Medium"] = "medium";
    IssueSeverity["High"] = "high";
    IssueSeverity["Critical"] = "critical";
})(IssueSeverity || (exports.IssueSeverity = IssueSeverity = {}));
let Issue = class Issue {
};
exports.Issue = Issue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Issue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_issue_code', { unique: true }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, unique: true }),
    __metadata("design:type", Object)
], Issue.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Issue.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Issue.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => specialty_entity_1.Specialty, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'mapped_specialty_id' }),
    __metadata("design:type", Object)
], Issue.prototype, "mappedSpecialty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: IssueSeverity, nullable: true }),
    __metadata("design:type", Object)
], Issue.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Issue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Issue.prototype, "updatedAt", void 0);
exports.Issue = Issue = __decorate([
    (0, typeorm_1.Entity)({ name: 'issue' })
], Issue);
