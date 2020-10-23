import { SimpleDataProviderServer } from "./SimpleDataProviderServer";

export interface SimpleDataProviderServerEventHook {
    onCreate: (dataProviderServer: SimpleDataProviderServer, resource: string, data: any) => Promise<void>;

    onUpdate: (dataProviderServer: SimpleDataProviderServer, resource: string, filter: any, data: any) => Promise<void>;
}
