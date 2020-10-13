import express from "express";
import cors from "cors";
import { SimpleDataProviderServer } from "./SimpleDataProviderServer";

export class SimpleHttpServer {
    dataProvider: SimpleDataProviderServer;
    resource: string;
    port: number;

    constructor(dataProvider: SimpleDataProviderServer, resource: string, port: number) {
        this.dataProvider = dataProvider;
        this.resource = resource;
        this.port = port;
    }

    listen() {
        const app = express();

        app.use(express.json());
        app.use(
            express.urlencoded({
                extended: true,
            }),
        );

        app.use(cors());

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

        app.get("*", function (req, res) {
            return res.status(404).send(`404 error: not found: ${req.url}`);
        });

        app.listen(this.port, () => console.log(`Garden server listening on port ${this.port}!`));
    }
}
