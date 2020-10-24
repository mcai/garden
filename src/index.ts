import { SimpleMongoDbDataProvider } from "./dataProviders/SimpleMongoDbDataProvider";
import { SimpleServer } from "./servers/SimpleServer";
import { SimpleDataProviderController } from "./controllers/SimpleDataProviderController";
import { SimpleHook } from "./hooks/SimpleHook";
import { SimpleEventLogHook } from "./hooks/SimpleEventLogHook";
import { SimpleCronPlanScheduler } from "./plans/SimpleCronPlanScheduler";
import { SimpleDataProvider } from "./dataProviders/SimpleDataProvider";
import { SimpleFormatting } from "./utils/SimpleFormatting";
import moment from "moment";
import cronstrue from "cronstrue";
import { Socket } from "socket.io";

export function listen(
    mongoDbConnectionString: string,
    port: number,
    hooks?: SimpleHook[],
    tasks?: { every: string; name: string; action: (dataProvider: SimpleDataProvider) => Promise<any> }[],
    socketIOEventHandlers?: {
        name: string;
        action: (socket: Socket, params: any) => void;
    }[],
) {
    const dataProvider = new SimpleMongoDbDataProvider(mongoDbConnectionString, [
        new SimpleEventLogHook(),
        ...(hooks ?? []),
    ]);

    (async () => await dataProvider.connect())();

    const scheduler = new SimpleCronPlanScheduler();

    tasks?.forEach((task) => {
        scheduler.register(task.name, async (params: any) => {
            const now = SimpleFormatting.toFormattedDateTimeString(moment());
            const every = cronstrue.toString(task.every);
            const result = await task.action(dataProvider);
            console.log(`[${now} SimpleServer] tasks.${task.name}@"${every}": result=${JSON.stringify(result)}`);
        });
        scheduler.schedule(task.every, task.name, {});
    });

    scheduler.start();

    SimpleServer.listen(new SimpleDataProviderController(dataProvider), port, socketIOEventHandlers);
}
