import { Repository } from 'typeorm';
import { Specialty } from '../../entities/specialty.entity';
export declare class SpecialtyService {
    private repo;
    constructor(repo: Repository<Specialty>);
    create(data: {
        code: string;
        name: string;
        description?: string;
    }): Promise<Specialty>;
    findAll(filter?: {
        search?: string;
    }): Promise<Specialty[]>;
    searchByName(keyword: string): Promise<Specialty[]>;
    findOne(id: string): Promise<Specialty>;
    findByCode(code: string): Promise<Specialty>;
    update(id: string, data: Partial<Specialty>): Promise<Specialty>;
    remove(id: string): Promise<{
        id: string;
        removed: boolean;
    }>;
    getStaffBySpecialty(specialtyId: string): Promise<{
        specialty: Specialty;
        staff: any;
    }>;
}
