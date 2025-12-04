import { BootstrapService } from './bootstrap.service';
export declare class BootstrapController {
    private readonly svc;
    constructor(svc: BootstrapService);
    createAdmin(body: any, secret?: string): Promise<any>;
}
