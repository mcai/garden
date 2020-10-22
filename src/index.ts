import { SimpleMongoDbDataProviderServer } from "./data/SimpleMongoDbDataProviderServer";
import { SimpleServer } from "./data/SimpleServer";
import { SimpleDataProviderBasedController } from "./data/SimpleDataProviderBasedController";

export function listen(connectionString: string, port: number, resources: string[]) {
    const controllers = resources.map((resource: string) => {
        const dataProvider = new SimpleMongoDbDataProviderServer(connectionString, resource);

        return new SimpleDataProviderBasedController(resource, dataProvider);
    });

    const httpServer = new SimpleServer(port, controllers);

    httpServer.listen();
}
