import {SimpleDataProviderServer} from "./SimpleDataProviderServer";
import {Connection, createConnection, Document, Model, Schema, SchemaDefinition} from "mongoose";

export class SimpleMongoDbDataProviderServer implements SimpleDataProviderServer {
    connectionString: string;
    databaseName: string;
    name: string;
    schemaDefinition?: SchemaDefinition;

    private connection?: Connection;
    private model?: Model<Document, {}>;

    constructor(
        connectionString: string,
        databaseName: string,
        name: string,
        schemaDefinition: SchemaDefinition
    ) {
        this.connectionString = connectionString;
        this.databaseName = databaseName;
        this.name = name;
        this.schemaDefinition = schemaDefinition;
    }

    async connect(
    ): Promise<void> {
        this.connection = await createConnection(
            this.connectionString + "/" + this.databaseName,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        this.model = this.connection?.model(this.name, new Schema(this.schemaDefinition));
    }

    all<ItemT>(
        ordering?: any,
        filter?: {
            [key: string]: any
        }
    ): Promise<ItemT[] | undefined> {
        return this.model?.find({
            ...filter
        }) as any;
    }

    find<ItemT>(
        pageSize: number,
        pageNum: number,
        ordering?: any,
        filter?: {
            [key: string]: any
        }
    ): Promise<{
        count: number,
        pageCount: number,
        itemsInCurrentPage: ItemT[]
    } | undefined> {
        return this.model?.find({ // TODO: paging
            ...filter
        }) as any;
    }

    one<RecordT>(
        filter?: {
            [key: string]: any
        }
    ): Promise<RecordT | undefined> {
        return this.model?.findOne({
            ...filter
        }) as any;
    }

    create<RecordT>(
        data: {
            [key: string]: any
        }
    ): Promise<RecordT | undefined> {
        return this.model?.create({
            ...data
        }) as any;
    }

    update<RecordT>(
        id: number,
        data: {
            [key: string]: any
        }
    ): Promise<RecordT | undefined> {
        return this.model?.updateOne(
            {
                id: id
            },
            {
                ...data
            }
        ) as any;
    }

    remove<RecordT>(
        id: number,
        data: {
            [key: string]: any
        }
    ): Promise<void> {
        return this.model?.deleteOne({
            id: id,
            ...data
        }) as any;
    }
}
