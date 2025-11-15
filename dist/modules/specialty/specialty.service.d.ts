import { Repository } from 'typeorm';
import { Specialty } from '../../entities/specialty.entity';
export declare class SpecialtyService {
    private repo;
    constructor(repo: Repository<Specialty>);
    findAll(): Promise<Specialty[]>;
}
