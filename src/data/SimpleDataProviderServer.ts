export interface SimpleDataProviderServer {
    connect(): Promise<void>;

    all(
        orderings?: {
            key: string;
            descending: boolean;
        }[],
        filter?: {
            [key: string]: any;
        },
    ): Promise<any[] | undefined>;

    find(
        pageSize: number,
        pageNum: number,
        orderings?: {
            key: string;
            descending: boolean;
        }[],
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

    one(filter?: { [key: string]: any }): Promise<any | undefined>;

    create(data: { [key: string]: any }): Promise<any | undefined>;

    update(
        id: number,
        data: {
            [key: string]: any;
        },
    ): Promise<any | undefined>;

    remove(
        id: number,
        data: {
            [key: string]: any;
        },
    ): Promise<void>;
}
