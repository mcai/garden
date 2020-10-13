import { SimpleMongoDbDataProviderServer } from "./data/SimpleMongoDbDataProviderServer";
import { SimpleServer } from "./data/SimpleServer";
import { SimpleDataProviderBasedController } from "./data/SimpleDataProviderBasedController";
import { SimpleResource } from "./data/SimpleResource";

export function listen(connectionString: string, port: number, resources: SimpleResource[]) {
    const controllers = resources.map((resource: SimpleResource) => {
        const dataProvider = new SimpleMongoDbDataProviderServer(
            connectionString,
            resource.name,
            resource.schemaDefinition,
        );

        return new SimpleDataProviderBasedController(resource.name, dataProvider);
    });

    const httpServer = new SimpleServer(port, controllers);

    httpServer.listen();
}
