import { StaffSpecialty } from './staff-specialty.entity';
export declare class Specialty {
    id: string;
    code: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    staffSpecialties: StaffSpecialty[];
}
