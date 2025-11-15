import { RoomRequirement } from './room-requirement.entity';
import { Room } from './room.entity';
export declare class RoomRequirementFulfillment {
    id: string;
    requirement: RoomRequirement;
    room: Room;
    startAt: Date | null;
    endAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
