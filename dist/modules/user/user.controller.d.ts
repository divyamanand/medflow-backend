import { UserService } from './user.service';
export declare class UserController {
    private readonly svc;
    constructor(svc: UserService);
    list(q: any): Promise<import("../../entities/user.entity").User[]>;
    get(id: string, req: any): Promise<import("../../entities/user.entity").User | null>;
    create(body: any): Promise<import("../../entities/user.entity").User>;
    update(id: string, body: any, req: any): Promise<import("../../entities/user.entity").User | null>;
    remove(id: string): Promise<any>;
}
