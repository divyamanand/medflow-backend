"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const issue_entity_1 = require("../../entities/issue.entity");
const specialty_entity_1 = require("../../entities/specialty.entity");
const issue_controller_1 = require("./issue.controller");
const issue_service_1 = require("./issue.service");
let IssueModule = class IssueModule {
};
exports.IssueModule = IssueModule;
exports.IssueModule = IssueModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([issue_entity_1.Issue, specialty_entity_1.Specialty])],
        controllers: [issue_controller_1.IssueController],
        providers: [issue_service_1.IssueService],
    })
], IssueModule);
