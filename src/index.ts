import { SimpleMongoDbDataProviderServer } from "./data/SimpleMongoDbDataProviderServer";
import { SimpleHttpServer } from "./data/SimpleHttpServer";
import { SimpleDataProviderBasedHttpController } from "./data/SimpleDataProviderBasedHttpController";

export function listen(
    connectionString: string,

    databaseName: string,
    name: string,
    schemaDefinition: any,
    resource: string,

    port: number,
) {
    const dataProvider = new SimpleMongoDbDataProviderServer(connectionString, databaseName, name, schemaDefinition);

    const controller = new SimpleDataProviderBasedHttpController(resource, dataProvider);

    const httpServer = new SimpleHttpServer(port, [controller]);

    httpServer.listen();
}
