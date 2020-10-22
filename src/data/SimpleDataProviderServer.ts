export interface SimpleDataProviderServer {
    connect(): Promise<void>;

    getList(
        resource: string,
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
        resource: string,
        ordering: {
            key: string;
            descending: boolean;
        },
        filter: any,
    ): Promise<{
        data: any[];
    }>;

    countOne(
        resource: string,
        filter: any,
    ): Promise<{
        data: number;
    }>;

    countMany(
        resource: string,
        filters: any[],
    ): Promise<{
        data: number[];
    }>;

    getOne(
        resource: string,
        filter: any,
    ): Promise<{
        data: any;
    }>;

    getMany(
        resource: string,
        filters: any[],
    ): Promise<{
        data: any[];
    }>;

    create(
        resource: string,
        data: any,
    ): Promise<{
        data: any;
    }>;

    update(
        resource: string,
        filter: any,
        data: any,
    ): Promise<{
        data: any;
    }>;

    delete(resource: string, filter: any): Promise<void>;
}
