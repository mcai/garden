import { SimpleMongoDbDataProviderServer } from "./data/SimpleMongoDbDataProviderServer";
import { SimpleServer } from "./servers/SimpleServer";
import { SimpleDataProviderBasedController } from "./controllers/SimpleDataProviderBasedController";

export function listen(connectionString: string, port: number) {
    new SimpleServer(port, [
        new SimpleDataProviderBasedController(new SimpleMongoDbDataProviderServer(connectionString)),
    ]).listen();
}
