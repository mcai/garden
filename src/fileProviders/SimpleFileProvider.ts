export interface SimpleFileProvider {
    connect(): Promise<void>;

    getOne(
        bucket: string,
        key: string,
    ): Promise<{
        data: any;
    }>;

    create(
        bucket: string,
        data: any,
    ): Promise<{
        key: string;
    }>;

    delete(bucket: string, key: string): Promise<void>;
}
