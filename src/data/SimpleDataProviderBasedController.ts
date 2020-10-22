import { SimpleDataProviderServer } from "./SimpleDataProviderServer";
import express from "express";
import { SimpleController } from "./SimpleController";
import pluralize from "pluralize";

export class SimpleDataProviderBasedController implements SimpleController {
    name: string;
    resources: string;
    dataProvider: SimpleDataProviderServer;

    constructor(name: string, dataProvider: SimpleDataProviderServer) {
        this.dataProvider = dataProvider;
        this.name = name;
        this.resources = pluralize(this.name);
    }

    async register(app: express.Express): Promise<void> {
        await this.dataProvider.connect();

        app.get(`/${this.resources}/getList`, async (req, res) => {
            const { paging, ordering, filter } = req.query;
            const result = await this.dataProvider.getList(
                {
                    pageSize: Number((paging as any).pageSize),
                    pageNum: Number((paging as any).pageNum),
                },
                ordering as any,
                filter,
            );
            return res.json(result);
        });

        app.get(`/${this.resources}/getAll`, async (req, res) => {
            const { ordering, filter } = req.query;
            const result = await this.dataProvider.getAll(ordering as any, filter);
            return res.json(result);
        });

        app.get(`/${this.resources}/count`, async (req, res) => {
            const { filter } = req.query;
            const result = await this.dataProvider.count(filter);
            return res.json(result);
        });

        app.get(`/${this.resources}/getOne`, async (req, res) => {
            const { filter } = req.query;
            const result = await this.dataProvider.getOne(filter);
            return res.json(result);
        });

        app.get(`/${this.resources}/getMany`, async (req, res) => {
            const { filters } = req.query;
            const result = await this.dataProvider.getMany(filters as any);
            return res.json(result);
        });

        app.post(`/${this.resources}/create`, async (req, res) => {
            const { data } = req.body;
            const result = await this.dataProvider.create(data);
            return res.json(result);
        });

        app.post(`/${this.resources}/update`, async (req, res) => {
            const { filter, data } = req.body;
            const result = await this.dataProvider.update(filter, data);
            return res.json(result);
        });

        app.post(`/${this.resources}/delete`, async (req, res) => {
            const { filter } = req.body;
            await this.dataProvider.delete(filter);
            return res.json({});
        });
    }
}
