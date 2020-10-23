import { SimpleDataProviderServer } from "./SimpleDataProviderServer";
import { SimpleDataProviderServerEventHook } from "./SimpleDataProviderServerEventHook";

export class SimpleDataProviderServerEventLogHook implements SimpleDataProviderServerEventHook {
    async onCreate(dataProviderServer: SimpleDataProviderServer, resource: string, data: any): Promise<void> {
        if (!resource.endsWith(".eventLog")) {
            await dataProviderServer.create(resource + ".eventLog", {
                type: "create",
                resource: resource,
                data: data,
            });
        }
    }

    async onUpdate(
        dataProviderServer: SimpleDataProviderServer,
        resource: string,
        filter: any,
        data: any,
    ): Promise<void> {
        if (!resource.endsWith(".eventLog")) {
            await dataProviderServer.create(resource + ".eventLog", {
                type: "update",
                resource: resource,
                filter: filter,
                data: data,
            });
        }
    }
}
