import {SimpleDataProviderServer} from "./SimpleDataProviderServer";

export class SimpleMongoDbDataProviderServer implements SimpleDataProviderServer {
    all<ItemT>(
        ordering?: any,
        filter?: {
            [key: string]: any
        }
    ): Promise<ItemT[] | undefined> {
        return Promise.resolve(undefined);
    }

    find<ItemT>(
        pageSize: number,
        pageNum: number,
        ordering?: any,
        filter?: {
            [key: string]: any
        }
    ): Promise<{
        count: number,
        pageCount: number,
        itemsInCurrentPage: ItemT[]
    } | undefined> {
        return Promise.resolve(undefined);
    }

    one<RecordT>(
        filter?: {
            [key: string]: any
        }
    ): Promise<RecordT | undefined> {
        return Promise.resolve(undefined);
    }

    create<RecordT>(
        data: {
            [key: string]: any
        }
    ): Promise<RecordT | undefined> {
        return Promise.resolve(undefined);
    }

    update<RecordT>(
        id: number,
        data: {
            [key: string]: any
        }
    ): Promise<RecordT | undefined> {
        return Promise.resolve(undefined);
    }

    remove<RecordT>(
        id: number,
        data: {
            [key: string]: any
        }
    ): Promise<void> {
        return Promise.resolve(undefined);
    }
}
