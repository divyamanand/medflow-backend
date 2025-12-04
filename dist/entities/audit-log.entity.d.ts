export declare class AuditLog {
    id: string;
    entityType: string;
    entityId: string;
    action: string;
    performedBy: string | null;
    payload: any | null;
    createdAt: Date;
}
