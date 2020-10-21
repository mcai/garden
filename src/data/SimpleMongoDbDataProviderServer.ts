import { SimpleDataProviderServer } from "./SimpleDataProviderServer";
import { Connection, createConnection, Document, Model, Schema } from "mongoose";
import pluralize from "pluralize";

export class SimpleMongoDbDataProviderServer implements SimpleDataProviderServer {
    connectionString: string;
    name: string;
    schema: Schema;

    private connection?: Connection;
    private model?: Model<Document, any>;

    constructor(connectionString: string, name: string, schema: Schema) {
        this.connectionString = connectionString;
        this.name = name;
        this.schema = schema;
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
        ordering?: {
            key: string;
            descending: boolean;
        },
        filter?: any,
    ): Promise<{
        itemsInCurrentPage: any;
        pageCount: number;
        count: number;
    }> {
        const countQuery = this.model?.find(filter);

        const count = JSON.parse(JSON.stringify(await countQuery.countDocuments()));

        const pageCount = Math.ceil(count / pageSize);

        let query = this.model?.find(filter);

        if (ordering != undefined) {
            query = query?.sort({
                [ordering.key]: ordering.descending ? -1 : 1,
            });
        }

        query = query.skip(pageSize * pageNum).limit(pageSize);

        const itemsInCurrentPage = JSON.parse(JSON.stringify(await query));

        return {
            itemsInCurrentPage: itemsInCurrentPage,
            pageCount: pageCount,
            count: count,
        };
    }

    async find(
        pageSize: number,
        pageNum: number,
        ordering?: {
            key: string;
            descending: boolean;
        },
        filter?: any,
    ): Promise<
        | {
              count: number;
              pageCount: number;
              itemsInCurrentPage: any[];
          }
        | undefined
    > {
        return await this.paging(pageSize, pageNum, ordering, filter);
    }

    async all(
        ordering?: {
            key: string;
            descending: boolean;
        },
        filter?: any,
    ): Promise<any[] | undefined> {
        let query = this.model?.find(filter);

        if (ordering != undefined) {
            query = query?.sort({
                [ordering.key]: ordering.descending ? -1 : 1,
            });
        }

        return JSON.parse(JSON.stringify(await query));
    }

    async count(filter?: any): Promise<number | undefined> {
        const query = this.model?.find(filter);
        return JSON.parse(JSON.stringify(await query.countDocuments()));
    }

    async one(filter?: any): Promise<any | undefined> {
        const query = this.model?.findOne(filter);
        return JSON.parse(JSON.stringify(await query));
    }

    async create(data?: any): Promise<any | undefined> {
        const query = this.model?.create(data);
        return JSON.parse(JSON.stringify(await query));
    }

    async update(filter?: any, data?: any): Promise<any | undefined> {
        const query = this.model?.updateOne(filter, data);
        return JSON.parse(JSON.stringify(await query));
    }

    async remove(filter: any): Promise<void> {
        const query = this.model?.deleteOne(filter);
        return JSON.parse(JSON.stringify(await query));
    }
}
