import { Repository } from 'typeorm';
import { Issue } from '../../entities/issue.entity';
export declare class IssueService {
    private issueRepo;
    constructor(issueRepo: Repository<Issue>);
    create(data: Partial<Issue>): Promise<Issue>;
    findAll(): Promise<Issue[]>;
    getMappedDoctors(issueId: string): Promise<any>;
}
