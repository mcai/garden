import { SimpleFileProvider } from "./SimpleFileProvider";
import { Promise } from "mongoose";
import OSS from "ali-oss";

export class SimpleAliyunOssFileProvider implements SimpleFileProvider {
    private ossClient?: OSS;

    constructor(endpoint: string, accessKeyId: string, accessKeySecret: string) {
        this.ossClient = new OSS({
            endpoint: endpoint,
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
        });
    }

    connect(): Promise<void> {
        return Promise.resolve(null);
    }

    async getOne(bucket: string, key: string): Promise<{ data: any }> {
        this.ossClient?.useBucket(bucket);

        const result = await this.ossClient?.get(key);

        return {
            data: result?.content,
        };
    }

    async create(bucket: string, key: string, data: any): Promise<void> {
        this.ossClient?.useBucket(bucket);

        await this.ossClient?.put(key, data);
    }

    async delete(bucket: string, key: string): Promise<void> {
        this.ossClient?.useBucket(bucket);

        await this.ossClient?.delete(key);
    }
}
