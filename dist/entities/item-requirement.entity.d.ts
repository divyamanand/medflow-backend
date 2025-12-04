export declare enum RequirementStatus {
    Open = "open",
    InProgress = "inProgress",
    Fulfilled = "fulfilled",
    Cancelled = "cancelled"
}
export declare class ItemRequirement {
    id: string;
    primaryUserId: string;
    kind: 'equipment' | 'blood';
    quantity: number;
    fulfilledCount: number;
    startTime: Date | null;
    estimatedEndTime: Date | null;
    status: RequirementStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
