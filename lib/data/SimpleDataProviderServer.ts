export interface SimpleDataProviderServer {
    connect(
    ): Promise<void>;

    all<ItemT>(
        ordering?: any,
        filter?: {
            [key: string]: any
        }
    ): Promise<ItemT[] | undefined>;

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
    } | undefined>;

    one<RecordT>(
        filter?: {
            [key: string]: any
        }
    ): Promise<RecordT | undefined>

    create<RecordT>(
        data: {
            [key: string]: any
        }
    ): Promise<RecordT | undefined>;

    update<RecordT>(
        id: number,
        data: {
            [key: string]: any
        }
    ): Promise<RecordT | undefined>;

    remove<RecordT>(
        id: number,
        data: {
            [key: string]: any
        }
    ): Promise<void>;
}

