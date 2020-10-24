import { SimplePlanScheduler } from "./SimplePlanScheduler";
import { SimplePlan } from "./SimplePlan";
import { schedule, ScheduledTask } from "node-cron";

export class SimpleCronPlanScheduler implements SimplePlanScheduler {
    private plans: { [name: string]: SimplePlan };
    private scheduledTasks: ScheduledTask[];

    constructor() {
        this.plans = {};
        this.scheduledTasks = [];
    }

    register(plan: SimplePlan) {
        this.plans[plan.name] = plan;
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
