import { SimpleDataProviderServer } from "./SimpleDataProviderServer";
import express from "express";
import { SimpleController } from "./SimpleController";

export class SimpleDataProviderBasedHttpController implements SimpleController {
    resource: string;
    dataProvider: SimpleDataProviderServer;

    constructor(resource: string, dataProvider: SimpleDataProviderServer) {
        this.dataProvider = dataProvider;
        this.resource = resource;
    }

    async register(app: express.Express): Promise<void> {
        await this.dataProvider.connect();

        app.get(`/${this.resource}/all`, async (req, res) => {
            const orderings = req.query.orderings as any;
            const filter = req.query.filter as any;
            const result = await this.dataProvider.all(orderings, filter);
            return res.json(result);
        });

        app.get(`/${this.resource}/find`, async (req, res) => {
            const pageSize = req.query.pageSize as any;
            const pageNum = req.query.pageNum as any;
            const orderings = req.query.orderings as any;
            const filter = req.query.filter as any;
            const result = await this.dataProvider.find(pageSize, pageNum, orderings, filter);
            return res.json(result);
        });

        app.get(`/${this.resource}/one`, async (req, res) => {
            const filter = req.query.filter as any;
            const result = await this.dataProvider.one(filter);
            return res.json(result);
        });

        app.post(`/${this.resource}/create`, async (req, res) => {
            const data = req.body.data as any;
            const result = await this.dataProvider.create(data);
            return res.json(result);
        });

        app.post(`/${this.resource}/update`, async (req, res) => {
            const id = req.body.id as any;
            const data = req.body.data as any;
            const result = await this.dataProvider.update(id, data);
            return res.json(result);
        });

        app.post(`/${this.resource}/remove`, async (req, res) => {
            const id = req.body.id as any;
            const data = req.body.data as any;
            await this.dataProvider.remove(id, data);
            return res.json({});
        });
    }
}
