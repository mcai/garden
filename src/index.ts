import { SimpleMongoDbDataProviderServer } from "./data/SimpleMongoDbDataProviderServer";
import { SimpleHttpServer } from "./data/SimpleHttpServer";

export function listen(
    connectionString: string,
    databaseName: string,
    name: string,
    schemaDefinition: any,
    resource: string,
    port: number,
) {
    const dataProvider = new SimpleMongoDbDataProviderServer(connectionString, databaseName, name, schemaDefinition);

    const httpServer = new SimpleHttpServer(dataProvider, resource, port);
    httpServer.listen();
}
