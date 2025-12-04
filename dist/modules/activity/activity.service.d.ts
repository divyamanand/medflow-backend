import { Repository } from 'typeorm';
import { Activity } from '../../entities/activity.entity';
export declare class ActivityService {
    private repo;
    constructor(repo: Repository<Activity>);
    log(userId: string | null, action: string, ip?: string | null, meta?: any): Promise<Activity>;
    list(filter?: any): Promise<Activity[]>;
}
