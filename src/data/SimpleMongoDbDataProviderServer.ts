import { SimpleDataProviderServer } from "./SimpleDataProviderServer";
import { Connection, createConnection, Document, Model, Schema } from "mongoose";
import pluralize from "pluralize";

export class SimpleMongoDbDataProviderServer implements SimpleDataProviderServer {
    connectionString: string;
    name: string;
    schema: Schema;

    private connection?: Connection;
    private model?: Model<Document, any>;

    constructor(connectionString: string, name: string) {
        this.connectionString = connectionString;
        this.name = name;
        this.schema = new Schema({ any: {} });
    }

    async connect(): Promise<void> {
        this.connection = await createConnection(this.connectionString + "/" + pluralize(this.name), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.model = this.connection?.model(this.name, this.schema);
    }

    private async paging(
        pageSize: number,
        pageNum: number,
        ordering: {
            key: string;
            descending: boolean;
        },
        filter: any,
    ): Promise<{
        data: any[];
        total: number;
    }> {
        const countQuery = this.model?.find(filter);

        const total = JSON.parse(JSON.stringify(await countQuery.countDocuments()));

        let query = this.model?.find(filter);

        query = query?.sort({
            [ordering.key]: ordering.descending ? -1 : 1,
        });

        query = query.skip(pageSize * pageNum).limit(pageSize);

        const data = JSON.parse(JSON.stringify(await query));

        return {
            data: data,
            total: total,
        };
    }

    async getList(
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
        return await this.paging(paging.pageSize, paging.pageNum, ordering, filter);
    }

    async getAll(
        ordering: {
            key: string;
            descending: boolean;
        },
        filter: any,
    ): Promise<{
        data: any[];
    }> {
        let query = this.model?.find(filter);

        query = query?.sort({
            [ordering.key]: ordering.descending ? -1 : 1,
        });

        return {
            data: JSON.parse(JSON.stringify(await query)),
        };
    }

    async count(
        filter: any,
    ): Promise<{
        data: number;
    }> {
        const query = this.model?.find(filter);
        return {
            data: JSON.parse(JSON.stringify(await query.countDocuments())),
        };
    }

    async getOne(
        filter: any,
    ): Promise<{
        data: any;
    }> {
        const query = this.model?.findOne(filter);
        return {
            data: JSON.parse(JSON.stringify(await query)),
        };
    }

    async getMany(filters: any[]): Promise<{ data: any[] }> {
        const query = filters.map((filter) => this.model?.findOne(filter));

        return {
            data: (await Promise.all(query)).map((x: any) => JSON.parse(JSON.stringify(x))),
        };
    }

    async create(
        data: any,
    ): Promise<{
        data: any;
    }> {
        const query = this.model?.create(data);
        return {
            data: JSON.parse(JSON.stringify(await query)),
        };
    }

    async update(
        filter: any,
        data: any,
    ): Promise<{
        data: any;
    }> {
        const query = this.model?.updateOne(filter, data);
        return {
            data: JSON.parse(JSON.stringify(await query)),
        };
    }

    async delete(filter: any): Promise<void> {
        const query = this.model?.deleteOne(filter);
        return JSON.parse(JSON.stringify(await query));
    }
}
