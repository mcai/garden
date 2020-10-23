import { SimpleMongoDbDataProviderServer } from "./data/SimpleMongoDbDataProviderServer";
import { SimpleServer } from "./servers/SimpleServer";
import { SimpleDataProviderBasedController } from "./controllers/SimpleDataProviderBasedController";
import { SimpleDataProviderServerEventHook } from "./data/SimpleDataProviderServerEventHook";

export function listen(mongoDbConnectionString: string, port: number, hooks?: SimpleDataProviderServerEventHook[]) {
    new SimpleServer(port, [
        new SimpleDataProviderBasedController(new SimpleMongoDbDataProviderServer(mongoDbConnectionString, hooks)),
    ]).listen();
}
