import { SimplePlanScheduler } from "./SimplePlanScheduler";
import { schedule, ScheduledTask } from "node-cron";

export class SimpleCronPlanScheduler implements SimplePlanScheduler {
    private actions: { [name: string]: (params: any) => void };
    private scheduledTasks: ScheduledTask[];

    constructor() {
        this.actions = {};
        this.scheduledTasks = [];
    }

    register(name: string, action: (params: any) => void) {
        this.actions[name] = action;
    }

    schedule(every: string, name: string, params: any): void {
        const action = this.actions[name];
        const scheduledTask = schedule(every, () => action(params));
        this.scheduledTasks = [...this.scheduledTasks, scheduledTask];
    }

    start(): void {
        this.scheduledTasks.forEach((scheduledTask) => scheduledTask.start());
    }

    stop(): void {
        this.scheduledTasks.forEach((scheduledTask) => scheduledTask.stop());
    }
}
