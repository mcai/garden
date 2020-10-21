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

        app.get(`/${this.resources}/find`, async (req, res) => {
            const { pageSize, pageNum, ordering, filter } = req.query;
            const result = await this.dataProvider.find(
                parseInt(pageSize as any),
                parseInt(pageNum as any),
                ordering as any,
                filter,
            );
            return res.json(result);
        });

        app.get(`/${this.resources}/all`, async (req, res) => {
            const { ordering, filter } = req.query;
            const result = await this.dataProvider.all(ordering as any, filter);
            return res.json(result);
        });

        app.get(`/${this.resources}/count`, async (req, res) => {
            const { filter } = req.query;
            const result = await this.dataProvider.count(filter);
            return res.json(result);
        });

        app.get(`/${this.resources}/one`, async (req, res) => {
            const { filter } = req.query;
            const result = await this.dataProvider.one(filter);
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

        app.post(`/${this.resources}/remove`, async (req, res) => {
            const { filter } = req.body;
            await this.dataProvider.remove(filter);
            return res.json({});
        });
    }
}
