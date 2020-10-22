import { SimpleMongoDbDataProviderServer } from "./data/SimpleMongoDbDataProviderServer";
import { SimpleServer } from "./data/SimpleServer";
import { SimpleDataProviderBasedController } from "./data/SimpleDataProviderBasedController";

export function listen(connectionString: string, port: number) {
    new SimpleServer(port, [
        new SimpleDataProviderBasedController(new SimpleMongoDbDataProviderServer(connectionString)),
    ]).listen();
}
