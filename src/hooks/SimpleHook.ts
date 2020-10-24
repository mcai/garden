import { SimpleDataProvider } from "../dataProviders/SimpleDataProvider";

export interface SimpleHook {
    onCreate: (dataProviderServer: SimpleDataProvider, resource: string, data: any) => Promise<void>;

    onUpdate: (dataProviderServer: SimpleDataProvider, resource: string, filter: any, data: any) => Promise<void>;
}
