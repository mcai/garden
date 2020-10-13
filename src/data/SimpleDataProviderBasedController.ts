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

        app.get(`/${this.resources}/all`, async (req, res) => {
            const orderings = req.query.orderings as any;
            const filter = req.query.filter as any;
            const result = await this.dataProvider.all(orderings, filter);
            return res.json(result);
        });

        app.get(`/${this.resources}/find`, async (req, res) => {
            const pageSize = req.query.pageSize as any;
            const pageNum = req.query.pageNum as any;
            const orderings = req.query.orderings as any;
            const filter = req.query.filter as any;
            const result = await this.dataProvider.find(pageSize, pageNum, orderings, filter);
            return res.json(result);
        });

        app.get(`/${this.resources}/one`, async (req, res) => {
            const filter = req.query.filter as any;
            const result = await this.dataProvider.one(filter);
            return res.json(result);
        });

        app.post(`/${this.resources}/create`, async (req, res) => {
            const data = req.body.data as any;
            const result = await this.dataProvider.create(data);
            return res.json(result);
        });

        app.post(`/${this.resources}/update`, async (req, res) => {
            const id = req.body.id as any;
            const data = req.body.data as any;
            const result = await this.dataProvider.update(id, data);
            return res.json(result);
        });

        app.post(`/${this.resources}/remove`, async (req, res) => {
            const id = req.body.id as any;
            const data = req.body.data as any;
            await this.dataProvider.remove(id, data);
            return res.json({});
        });
    }
}
