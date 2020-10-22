export interface SimpleDataProviderServer {
    connect(): Promise<void>;

    getList(
        paging: {
            pageSize: number;
            pageNum: number;
        },
        ordering: {
            key: string;
            descending: boolean;
        },
        filter: any,
    ): Promise<{
        data: any[];
        total: number;
    }>;

    getAll(
        ordering: {
            key: string;
            descending: boolean;
        },
        filter: any,
    ): Promise<{
        data: any[];
    }>;

    count(
        filter: any,
    ): Promise<{
        data: number;
    }>;

    getOne(
        filter: any,
    ): Promise<{
        data: any;
    }>;

    getMany(
        filters: any[],
    ): Promise<{
        data: any;
    }>;

    create(
        data: any,
    ): Promise<{
        data: any;
    }>;

    update(
        filter: any,
        data?: any,
    ): Promise<{
        data: any;
    }>;

    delete(filter: any): Promise<void>;
}
