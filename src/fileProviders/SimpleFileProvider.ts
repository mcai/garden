export interface SimpleFileProvider {
    connect(): Promise<void>;

    getOne(key: string): Promise<{ data: any }>;

    create(key: string, data: any): Promise<void>;

    delete(key: string): Promise<void>;
}
