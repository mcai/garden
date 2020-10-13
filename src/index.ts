import { SimpleMongoDbDataProviderServer } from "./data/SimpleMongoDbDataProviderServer";
import { SimpleHttpServer } from "./data/SimpleHttpServer";
import { SimpleDataProviderBasedHttpController } from "./data/SimpleDataProviderBasedHttpController";
import { SimpleResource } from "./data/SimpleResource";

export function listen(connectionString: string, port: number, resources: SimpleResource[]) {
    const controllers = resources.map((resource: SimpleResource) => {
        const dataProvider = new SimpleMongoDbDataProviderServer(
            connectionString,
            resource.databaseName,
            name,
            resource.schemaDefinition,
        );

        return new SimpleDataProviderBasedHttpController(resource.resource, dataProvider);
    });

    const httpServer = new SimpleHttpServer(port, controllers);

    httpServer.listen();
}
