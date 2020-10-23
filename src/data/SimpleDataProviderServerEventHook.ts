export interface SimpleDataProviderServerEventHook {
    onCreate: (resource: string, data: any) => void;

    onUpdate: (resource: string, filter: any, data: any) => void;
}
