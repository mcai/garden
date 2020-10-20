export interface SimpleDataProviderServer {
    connect(): Promise<void>;

    find(
        pageSize: number,
        pageNum: number,
        ordering?: {
            key: string;
            descending: boolean;
        },
        filter?: {
            [key: string]: any;
        },
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
        filter?: {
            [key: string]: any;
        },
    ): Promise<any[] | undefined>;

    one(filter?: { [key: string]: any }): Promise<any | undefined>;

    create(data: { [key: string]: any }): Promise<any | undefined>;

    update(
        id: any,
        data: {
            [key: string]: any;
        },
    ): Promise<any | undefined>;

    remove(
        id: any,
        data: {
            [key: string]: any;
        },
    ): Promise<void>;
}
