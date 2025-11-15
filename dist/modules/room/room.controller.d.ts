import { RoomService } from './room.service';
export declare class RoomController {
    private readonly svc;
    constructor(svc: RoomService);
    list(q: any): Promise<import("../../entities/room.entity").Room[]>;
    get(id: string): Promise<import("../../entities/room.entity").Room | null>;
    create(body: any): Promise<import("../../entities/room.entity").Room>;
    update(id: string, body: any): Promise<import("../../entities/room.entity").Room | null>;
    remove(id: string): Promise<any>;
    book(id: string, body: any): Promise<import("../../entities/room.entity").Room | null>;
    changeStatus(id: string, body: {
        status: string;
    }): Promise<import("../../entities/room.entity").Room | null>;
    assign(id: string, body: {
        patientId: string;
    }): Promise<import("../../entities/room.entity").Room | null>;
    available(type?: string): Promise<import("../../entities/room.entity").Room[]>;
}
