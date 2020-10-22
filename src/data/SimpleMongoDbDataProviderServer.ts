import { SimpleDataProviderServer } from "./SimpleDataProviderServer";
import { Connection, createConnection, Schema } from "mongoose";

export class SimpleMongoDbDataProviderServer implements SimpleDataProviderServer {
    connectionString: string;
    private connection?: Connection;
    private models: { [resource: string]: any };

    constructor(connectionString: string) {
        this.connectionString = connectionString;
        this.models = {};
    }

    async connect(): Promise<void> {
        this.connection = await createConnection(this.connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    private getModel(resource: string) {
        if (!(resource in this.models)) {
            this.models[resource] = this.connection?.model(resource, new Schema({}, { strict: false }));
        }

        return this.models[resource];
    }

    async getList(
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
    }> {
        const model = this.getModel(resource);

        const countQuery = model?.find(filter);

        const total = JSON.parse(JSON.stringify(await countQuery?.countDocuments()));

        let query = model?.find(filter);

        query = query?.sort({
            [ordering.key]: ordering.descending ? -1 : 1,
        });

        query = query?.skip(paging.pageSize * paging.pageNum).limit(paging.pageSize);

        const data = JSON.parse(JSON.stringify(await query));

        return {
            data: data,
            total: total,
        };
    }

    async getAll(
        resource: string,
        ordering: {
            key: string;
            descending: boolean;
        },
        filter: any,
    ): Promise<{
        data: any[];
    }> {
        const model = this.getModel(resource);

        let query = model?.find(filter);

        query = query?.sort({
            [ordering.key]: ordering.descending ? -1 : 1,
        });

        return {
            data: JSON.parse(JSON.stringify(await query)),
        };
    }

    async count(
        resource: string,
        filter: any,
    ): Promise<{
        data: number;
    }> {
        const model = this.getModel(resource);

        const query = model?.find(filter);
        return {
            data: JSON.parse(JSON.stringify(await query?.countDocuments())),
        };
    }

    async getOne(
        resource: string,
        filter: any,
    ): Promise<{
        data: any;
    }> {
        const model = this.getModel(resource);

        const query = model?.findOne(filter);
        return {
            data: JSON.parse(JSON.stringify(await query)),
        };
    }

    async getMany(resource: string, filters: any[]): Promise<{ data: any[] }> {
        const model = this.getModel(resource);

        const query = filters.map((filter) => model?.findOne(filter));

        return {
            data: (await Promise.all(query)).map((x: any) => JSON.parse(JSON.stringify(x))),
        };
    }

    async create(
        resource: string,
        data: any,
    ): Promise<{
        data: any;
    }> {
        const model = this.getModel(resource);

        const query = model?.create(data);
        return {
            data: JSON.parse(JSON.stringify(await query)),
        };
    }

    async update(
        resource: string,
        filter: any,
        data: any,
    ): Promise<{
        data: any;
    }> {
        const model = this.getModel(resource);

        const query = model?.updateOne(filter, data);
        return {
            data: JSON.parse(JSON.stringify(await query)),
        };
    }

    async delete(resource: string, filter: any): Promise<void> {
        const model = this.getModel(resource);

        const query = model?.deleteOne(filter);
        return JSON.parse(JSON.stringify(await query));
    }
}
