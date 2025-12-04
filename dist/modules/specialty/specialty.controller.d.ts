import { SpecialtyService } from './specialty.service';
export declare class SpecialtyController {
    private readonly svc;
    constructor(svc: SpecialtyService);
    list(query: any): Promise<import("../../entities/specialty.entity").Specialty[]>;
    search(keyword: string): Promise<import("../../entities/specialty.entity").Specialty[]>;
    create(body: {
        code: string;
        name: string;
        description?: string;
    }): Promise<import("../../entities/specialty.entity").Specialty>;
    get(id: string): Promise<import("../../entities/specialty.entity").Specialty>;
    getStaff(id: string): Promise<{
        specialty: import("../../entities/specialty.entity").Specialty;
        staff: any;
    }>;
    update(id: string, body: Partial<{
        code: string;
        name: string;
        description: string;
    }>): Promise<import("../../entities/specialty.entity").Specialty>;
    remove(id: string): Promise<{
        id: string;
        removed: boolean;
    }>;
}
