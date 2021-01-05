import { SimpleFileProvider } from "./SimpleFileProvider";
import { Promise } from "mongoose";
import OSS from "ali-oss";

export class SimpleAliyunOssFileProvider implements SimpleFileProvider {
    private ossClient?: OSS;

    constructor(region: string, accessKeyId: string, accessKeySecret: string, bucket: string) {
        this.ossClient = new OSS({
            region: region,
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
            bucket: bucket,
        });
    }

    connect(): Promise<void> {
        return Promise.resolve(null);
    }

    async getOne(key: string): Promise<{ data: any }> {
        const result = await this.ossClient?.get(key);

        return {
            data: result?.content,
        };
    }

    async create(key: string, data: any): Promise<void> {
        await this.ossClient?.put(key, data);
    }

    async delete(key: string): Promise<void> {
        await this.ossClient?.delete(key);
    }
}
