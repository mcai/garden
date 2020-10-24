export interface SimplePlanScheduler {
    register(name: string, action: (params: any) => void): void;

    schedule(every: string, name: string, params: any): void;

    start(): void;

    stop(): void;
}
