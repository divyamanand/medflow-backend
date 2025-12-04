import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
export declare class UserService {
    private repo;
    constructor(repo: Repository<User>);
    create(data: any): Promise<User>;
    findAll(filter?: any): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    update(id: string, data: any): Promise<User | null>;
    remove(id: string): Promise<any>;
}
