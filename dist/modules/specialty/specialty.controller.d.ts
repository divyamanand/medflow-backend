import { SpecialtyService } from './specialty.service';
export declare class SpecialtyController {
    private readonly svc;
    constructor(svc: SpecialtyService);
    list(): Promise<import("../../entities/specialty.entity").Specialty[]>;
}
