import { Staff } from './staff.entity';
import { Specialty } from './specialty.entity';
export declare class StaffSpecialty {
    id: string;
    staff: Staff;
    specialty: Specialty;
    primary: boolean;
}
