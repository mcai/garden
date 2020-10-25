import { SimpleDataProvider } from "./SimpleDataProvider";
import { Connection, createConnection, Schema } from "mongoose";
import { SimpleHook } from "../hooks/SimpleHook";
import { JSONPath } from "jsonpath-plus";

export class SimpleMongoDbDataProvider implements SimpleDataProvider {
    connectionString: string;
    hooks?: SimpleHook[];

    private readonly models: { [resource: string]: any };
    private connection?: Connection;

    constructor(connectionString: string, hooks?: SimpleHook[]) {
        this.connectionString = connectionString;
        this.hooks = hooks;

        this.models = {};
    }

    async connect(): Promise<void> {
        this.connection = await createConnection(this.connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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
        transform?: {
            jsonPath: string;
        },
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

        let data = JSON.parse(JSON.stringify(await query));

        if (transform != undefined) {
            data = JSONPath({
                json: data,
                path: transform.jsonPath,
            });
        }

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
        transform?: {
            jsonPath: string;
        },
    ): Promise<{
        data: any[];
    }> {
        const model = this.getModel(resource);

        let query = model?.find(filter);

        query = query?.sort({
            [ordering.key]: ordering.descending ? -1 : 1,
        });

        let data = JSON.parse(JSON.stringify(await query));

        if (transform != undefined) {
            data = data.map((item: any) =>
                JSONPath({
                    json: item,
                    path: transform.jsonPath,
                }),
            );
        }

        return {
            data: data,
        };
    }

    async getOne(
        resource: string,
        filter: any,
        transform?: {
            jsonPath: string;
        },
    ): Promise<{
        data: any;
    }> {
        const model = this.getModel(resource);

        const query = model?.findOne(filter);

        let data = JSON.parse(JSON.stringify(await query));

        if (transform != undefined) {
            data = JSONPath({
                json: data,
                path: transform.jsonPath,
            });
        }

        return {
            data: data,
        };
    }

    async getMany(
        resource: string,
        filters: any[],
        transform?: {
            jsonPath: string;
        },
    ): Promise<{ data: any[] }> {
        const model = this.getModel(resource);

        const query = filters.map((filter) => model?.findOne(filter));

        let data = (await Promise.all(query)).map((x: any) => JSON.parse(JSON.stringify(x)));

        if (transform != undefined) {
            data = data.map((item: any) =>
                JSONPath({
                    json: item,
                    path: transform.jsonPath,
                }),
            );
        }

        return {
            data: data,
        };
    }

    async countOne(
        resource: string,
        filter: any,
    ): Promise<{
        data: number;
    }> {
        const model = this.getModel(resource);

        const query = model?.find(filter)?.countDocuments();
        return {
            data: JSON.parse(JSON.stringify(await query)),
        };
    }

    async countMany(
        resource: string,
        filters: any[],
    ): Promise<{
        data: number[];
    }> {
        const model = this.getModel(resource);

        const query = filters.map((filter) => model?.find(filter)?.countDocuments());

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
        await Promise.all(this.hooks?.map((hook) => hook.onCreate(this, resource, data)) ?? []);

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
        await Promise.all(this.hooks?.map((hook) => hook.onUpdate(this, resource, filter, data)) ?? []);

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

    private getModel(resource: string) {
        if (!(resource in this.models)) {
            this.models[resource] = this.connection?.model(resource, new Schema({}, { strict: false }));
        }

        return this.models[resource];
    }
}
