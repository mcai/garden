import { SimpleFileProvider } from "./SimpleFileProvider";

export class SimpleAliyunOssFileProvider implements SimpleFileProvider {
    connect(): Promise<void> {
        return Promise.resolve(undefined);
    }

    create(bucket: string, data: any): Promise<{ key: string }> {
        return Promise.resolve({ key: "" });
    }

    delete(bucket: string, key: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    getOne(bucket: string, key: string): Promise<{ data: any }> {
        return Promise.resolve({ data: undefined });
    }
}
