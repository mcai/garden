import express from "express";
import cors from "cors";
import {SimpleDataProviderServer} from "./SimpleDataProviderServer";

export class SimpleHttpServer {
    name: string;
    dataProvider: SimpleDataProviderServer;
    port: number;

    constructor(
        name: string,
        dataProvider: SimpleDataProviderServer,
        port: number
    ) {
        this.name = name;
        this.dataProvider = dataProvider;
        this.port = port;
    }

    listen() {
        let app = express();

        app.use(express.json());
        app.use(express.urlencoded({
            extended: true
        }));

        app.use(cors());

        app.get(`/${name}/all`, (req, res) => {
            let orderings = req.query.orderings as any;
            let filter = req.query.filter as any;

            return res.send(this.dataProvider.all(
                orderings,
                filter
            ));
        });

        app.get(`/${name}/find`, (req, res) => {
            let pageSize = req.query.pageSize as any;
            let pageNum = req.query.pageNum as any;
            let orderings = req.query.orderings as any;
            let filter = req.query.filter as any;

            return res.send(this.dataProvider.find(
                pageSize,
                pageNum,
                orderings,
                filter
            ));
        });

        app.get(`/${name}/one`, (req, res) => {
            let filter = req.query.filter as any;

            return res.send(this.dataProvider.one(
                filter
            ));
        });

        app.post(`/${name}/create`, (req, res) => {
            let data = req.body.data as any;

            return res.send(this.dataProvider.create(
                data
            ));
        });

        app.post(`/${name}/update`, (req, res) => {
            let id = req.body.id as any;
            let data = req.body.data as any;

            return res.send(this.dataProvider.update(
                id,
                data
            ));
        });

        app.post(`/${name}/remove`, (req, res) => {
            let id = req.body.id as any;
            let data = req.body.data as any;

            return res.send(this.dataProvider.remove(
                id,
                data
            ));
        });

        app.get('*', function (req, res) {
            return res.status(404).send(`404 error: not found: ${req.url}`);
        });

        app.listen(this.port, () =>
            console.log(`Garden server listening on port ${this.port}!`),
        );
    }
}
