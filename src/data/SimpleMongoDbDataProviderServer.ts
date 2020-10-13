import { SimpleDataProviderServer } from "./SimpleDataProviderServer";
import { Connection, createConnection, Document, Model, Schema, SchemaDefinition } from "mongoose";
import pluralize from "pluralize";

export class SimpleMongoDbDataProviderServer implements SimpleDataProviderServer {
    connectionString: string;
    name: string;
    schemaDefinition?: SchemaDefinition;

    private connection?: Connection;
    private model?: Model<Document, any>;

    constructor(connectionString: string, name: string, schemaDefinition: SchemaDefinition) {
        this.connectionString = connectionString;
        this.name = name;
        this.schemaDefinition = schemaDefinition;
    }

    async connect(): Promise<void> {
        this.connection = await createConnection(this.connectionString + "/" + pluralize(this.name), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.model = this.connection?.model(this.name, new Schema(this.schemaDefinition));
    }

    private async paging(
        query: any,
        pageSize: number,
        pageNum: number,
    ): Promise<{
        itemsInCurrentPage: any;
        pageCount: number;
        count: number;
    }> {
        const count = await this.model?.countDocuments();

        const pageCount = Math.ceil(count / pageSize);

        query = query.skip(pageSize * pageNum).limit(pageSize);

        const itemsInCurrentPage = JSON.parse(JSON.stringify(await query));

        return {
            itemsInCurrentPage: itemsInCurrentPage.map((item: any) => ({ ...item, id: item._id })),
            pageCount: pageCount,
            count: count,
        };
    }

    async all(
        orderings?: {
            key: string;
            descending: boolean;
        }[],
        filter?: {
            [key: string]: any;
        },
    ): Promise<any[] | undefined> {
        let query = this.model?.find({
            ...filter,
        });

        orderings?.forEach((ordering) => {
            query = query?.sort({
                [ordering.key]: ordering.descending ? -1 : 1,
            });
        });

        const result = await query;

        return result.map((item: any) => ({ ...item, id: item._id }));
    }

    find(
        pageSize: number,
        pageNum: number,
        orderings?: {
            key: string;
            descending: boolean;
        }[],
        filter?: {
            [key: string]: any;
        },
    ): Promise<
        | {
              count: number;
              pageCount: number;
              itemsInCurrentPage: any[];
          }
        | undefined
    > {
        let query = this.model?.find({
            ...filter,
        });

        orderings?.forEach((ordering) => {
            query = query?.sort({
                [ordering.key]: ordering.descending ? -1 : 1,
            });
        });

        return this.paging(query, pageSize, pageNum);
    }

    async one(filter?: { [key: string]: any }): Promise<any | undefined> {
        const { id, ...otherParams } = filter ?? {};

        const query = this.model?.findOne({
            ...otherParams,
            _id: id,
        });

        const result = JSON.parse(JSON.stringify(await query));

        return {
            ...result,
            id: result._id,
        };
    }

    async create(data: { [key: string]: any }): Promise<any | undefined> {
        const query = this.model?.create({
            ...data,
        });

        const result = JSON.parse(JSON.stringify(await query));

        return {
            ...result,
            id: result?._id,
        };
    }

    async update(
        id: any,
        data: {
            [key: string]: any;
        },
    ): Promise<any | undefined> {
        const query = this.model?.updateOne(
            {
                _id: id,
            },
            {
                ...data,
            },
        );

        const result = JSON.parse(JSON.stringify(await query));

        return {
            ...result,
            id: result._id,
        };
    }

    async remove(
        id: any,
        data: {
            [key: string]: any;
        },
    ): Promise<void> {
        const query = this.model?.deleteOne({
            _id: id,
            ...data,
        });

        const result = JSON.parse(JSON.stringify(await query));

        return {
            ...result,
            id: result._id,
        };
    }
}
