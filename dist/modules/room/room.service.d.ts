import { Repository } from 'typeorm';
import { Room } from '../../entities/room.entity';
export declare class RoomService {
    private repo;
    constructor(repo: Repository<Room>);
    findAll(filter?: any): Promise<Room[]>;
    findOne(id: string): Promise<Room | null>;
    create(data: Partial<Room>): Promise<Room>;
    update(id: string, data: Partial<Room>): Promise<Room | null>;
    remove(id: string): Promise<any>;
    book(id: string, body: {
        appointmentId: string;
        start: string;
        end: string;
    }): Promise<Room | null>;
    assign(id: string, body: {
        patientId: string;
    }): Promise<Room | null>;
    changeStatus(id: string, status: Room['status']): Promise<Room | null>;
    findAvailable(type?: Room['type']): Promise<Room[]>;
    private normalizeRoomData;
}
