import { Specialty } from './specialty.entity';
export declare enum IssueSeverity {
    Low = "low",
    Medium = "medium",
    High = "high",
    Critical = "critical"
}
export declare class Issue {
    id: string;
    code: string | null;
    title: string;
    description: string | null;
    mappedSpecialty: Specialty | null;
    severity: IssueSeverity | null;
    createdAt: Date;
    updatedAt: Date;
}
