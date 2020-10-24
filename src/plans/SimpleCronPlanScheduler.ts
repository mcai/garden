import { SimplePlanScheduler } from "./SimplePlanScheduler";
import { schedule, ScheduledTask } from "node-cron";

export class SimpleCronPlanScheduler implements SimplePlanScheduler {
    private plans: { [name: string]: { name: string; action: (params: any) => void } };
    private scheduledTasks: ScheduledTask[];

    constructor() {
        this.plans = {};
        this.scheduledTasks = [];
    }

    register(name: string, action: (params: any) => void) {
        this.plans[name] = { name: name, action: action };
    }

    schedule(every: string, name: string, params: any): void {
        const plan = this.plans[name];
        const scheduledTask = schedule(every, () => plan.action(params));
        this.scheduledTasks = [...this.scheduledTasks, scheduledTask];
    }

    start(): void {
        this.scheduledTasks.forEach((scheduledTask) => scheduledTask.start());
    }

    stop(): void {
        this.scheduledTasks.forEach((scheduledTask) => scheduledTask.stop());
    }
}
