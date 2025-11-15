import { IssueService } from './issue.service';
export declare class IssueController {
    private readonly svc;
    constructor(svc: IssueService);
    create(body: any): Promise<import("../../entities/issue.entity").Issue>;
    list(): Promise<import("../../entities/issue.entity").Issue[]>;
    mappedDoctors(id: string): Promise<any>;
}
