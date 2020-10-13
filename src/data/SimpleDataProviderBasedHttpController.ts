import { SimpleDataProviderServer } from "./SimpleDataProviderServer";
import express from "express";
import { SimpleHttpController } from "./SimpleHttpController";

export class SimpleDataProviderBasedHttpController implements SimpleHttpController {
    resource: string;
    dataProvider: SimpleDataProviderServer;

    constructor(resource: string, dataProvider: SimpleDataProviderServer) {
        this.dataProvider = dataProvider;
        this.resource = resource;
    }

    register(app: express.Express): void {
        app.get(`/${this.resource}/all`, (req, res) => {
            const orderings = req.query.orderings as any;
            const filter = req.query.filter as any;

            return res.json(this.dataProvider.all(orderings, filter));
        });

        app.get(`/${this.resource}/find`, (req, res) => {
            const pageSize = req.query.pageSize as any;
            const pageNum = req.query.pageNum as any;
            const orderings = req.query.orderings as any;
            const filter = req.query.filter as any;

            return res.json(this.dataProvider.find(pageSize, pageNum, orderings, filter));
        });

        app.get(`/${this.resource}/one`, (req, res) => {
            const filter = req.query.filter as any;

            return res.json(this.dataProvider.one(filter));
        });

        app.post(`/${this.resource}/create`, (req, res) => {
            const data = req.body.data as any;

            return res.json(this.dataProvider.create(data));
        });

        app.post(`/${this.resource}/update`, (req, res) => {
            const id = req.body.id as any;
            const data = req.body.data as any;

            return res.json(this.dataProvider.update(id, data));
        });

        app.post(`/${this.resource}/remove`, (req, res) => {
            const id = req.body.id as any;
            const data = req.body.data as any;

            return res.json(this.dataProvider.remove(id, data));
        });
    }
}
