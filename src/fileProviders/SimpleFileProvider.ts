export interface SimpleFileProvider {
    connect(): Promise<void>;

    getOne(bucket: string, key: string): Promise<{ data: any }>;

    create(bucket: string, key: string, data: Buffer): Promise<void>;

    delete(bucket: string, key: string): Promise<void>;
}
