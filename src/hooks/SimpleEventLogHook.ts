import { SimpleDataProvider } from "../dataProviders/SimpleDataProvider";
import { SimpleHook } from "./SimpleHook";

export class SimpleEventLogHook implements SimpleHook {
    async onCreate(dataProviderServer: SimpleDataProvider, resource: string, data: any): Promise<void> {
        if (!resource.endsWith(".eventLog")) {
            await dataProviderServer.create(resource + ".eventLog", {
                type: "create",
                date: new Date(Date.now()).toISOString(),
                resource: resource,
                data: data,
            });
        }
    }

    async onUpdate(dataProviderServer: SimpleDataProvider, resource: string, filter: any, data: any): Promise<void> {
        if (!resource.endsWith(".eventLog")) {
            await dataProviderServer.create(resource + ".eventLog", {
                type: "update",
                date: new Date(Date.now()).toISOString(),
                resource: resource,
                filter: filter,
                data: data,
            });
        }
    }
}
