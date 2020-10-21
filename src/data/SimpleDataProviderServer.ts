export interface SimpleDataProviderServer {
    connect(): Promise<void>;

    find(
        pageSize: number,
        pageNum: number,
        ordering?: {
            key: string;
            descending: boolean;
        },
        filter?: any,
    ): Promise<
        | {
              count: number;
              pageCount: number;
              itemsInCurrentPage: any[];
          }
        | undefined
    >;

    all(
        ordering?: {
            key: string;
            descending: boolean;
        },
        filter?: any,
    ): Promise<any[] | undefined>;

    count(filter?: any): Promise<number | undefined>;

    one(filter?: any): Promise<any | undefined>;

    create(data?: any): Promise<any | undefined>;

    update(filter?: any, data?: any): Promise<any | undefined>;

    remove(filter: any): Promise<void>;
}
