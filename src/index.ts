import { SimpleMongoDbDataProvider } from "./dataProviders/SimpleMongoDbDataProvider";
import { SimpleServer } from "./servers/SimpleServer";
import { SimpleDataProviderController } from "./controllers/SimpleDataProviderController";
import { SimpleHook } from "./hooks/SimpleHook";
import { SimpleEventLogHook } from "./hooks/SimpleEventLogHook";

export function listen(mongoDbConnectionString: string, port: number, hooks?: SimpleHook[]) {
    new SimpleServer(port, [
        new SimpleDataProviderController(
            new SimpleMongoDbDataProvider(mongoDbConnectionString, [new SimpleEventLogHook(), ...(hooks ?? [])]),
        ),
    ]).listen();
}
