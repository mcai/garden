import { SimplePlan } from "./SimplePlan";

export interface SimplePlanScheduler {
    register(plan: SimplePlan): void;

    schedule(every: string, name: string, params: any): void;

    start(): void;

    stop(): void;
}
