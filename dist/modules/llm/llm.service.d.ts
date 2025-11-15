export declare class LlmService {
    private readonly logger;
    inferSpecialties(issues: string[], specialties: {
        id: string;
        name: string;
    }[]): Promise<string[]>;
    private heuristicMatch;
}
