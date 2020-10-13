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

    private paging(
        query: any,
        pageSize: number,
        pageNum: number,
    ): {
        itemsInCurrentPage: any;
        pageCount: number;
        count: number;
    } {
        const count = query.count;

        const pageCount = Math.ceil(count / pageSize);

        const itemsInCurrentPage = query.skip(pageSize * pageNum).limit(pageSize);

        return {
            itemsInCurrentPage: itemsInCurrentPage,
            pageCount: pageCount,
            count: count,
        };
    }

    all<ItemT>(
        orderings?: {
            key: string;
            descending: boolean;
        }[],
        filter?: {
            [key: string]: any;
        },
    ): Promise<ItemT[] | undefined> {
        let query = this.model?.find({
            ...filter,
        });

        orderings?.forEach((ordering) => {
            query = query?.sort({
                [ordering.key]: ordering.descending ? -1 : 1,
            });
        });

        return query as any;
    }

    find<ItemT>(
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
              itemsInCurrentPage: ItemT[];
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

        const paging = this.paging(query, pageSize, pageNum);

        return paging as any;
    }

    one<RecordT>(filter?: { [key: string]: any }): Promise<RecordT | undefined> {
        return this.model?.findOne({
            ...filter,
        }) as any;
    }

    create<RecordT>(data: { [key: string]: any }): Promise<RecordT | undefined> {
        return this.model?.create({
            ...data,
        }) as any;
    }

    update<RecordT>(
        id: number,
        data: {
            [key: string]: any;
        },
    ): Promise<RecordT | undefined> {
        return this.model?.updateOne(
            {
                id: id,
            },
            {
                ...data,
            },
        ) as any;
    }

    remove<RecordT>(
        id: number,
        data: {
            [key: string]: any;
        },
    ): Promise<void> {
        return this.model?.deleteOne({
            id: id,
            ...data,
        }) as any;
    }
}
