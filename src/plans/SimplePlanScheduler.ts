import { SimplePlan } from "./SimplePlan";

export interface SimplePlanScheduler {
    register(plan: SimplePlan): void;

    schedule(name: string, params: any): void;

    start(): void;

    stop(): void;
}
