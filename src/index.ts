import { SimpleMongoDbDataProvider } from "./dataProviders/SimpleMongoDbDataProvider";
import { SimpleServer } from "./servers/SimpleServer";
import { SimpleDataProviderController } from "./controllers/SimpleDataProviderController";
import { SimpleHook } from "./hooks/SimpleHook";
import { SimpleEventLogHook } from "./hooks/SimpleEventLogHook";
import { SimpleCronPlanScheduler } from "./plans/SimpleCronPlanScheduler";
import { SimpleFormatting } from "./utils/SimpleFormatting";
import moment from "moment";
import { SimpleDataProvider } from "./dataProviders/SimpleDataProvider";

export function listen(
    mongoDbConnectionString: string,
    port: number,
    hooks?: SimpleHook[],
    tasks?: { every: string; name: string; action: (dataProvider: SimpleDataProvider) => void }[],
) {
    const dataProvider = new SimpleMongoDbDataProvider(mongoDbConnectionString, [
        new SimpleEventLogHook(),
        ...(hooks ?? []),
    ]);

    (async () => await dataProvider.connect())();

    const scheduler = new SimpleCronPlanScheduler();

    tasks?.forEach((task) => {
        scheduler.register(task.name, () => task.action(dataProvider));
        scheduler.schedule(task.every, task.name, {});
    });

    scheduler.start();

    SimpleServer.listen(new SimpleDataProviderController(dataProvider), port);
}
