import express from "express";
import cors from "cors";
import { SimpleController } from "./SimpleController";

export class SimpleServer {
    port: number;
    controllers: SimpleController[];

    constructor(port: number, controllers: SimpleController[]) {
        this.port = port;
        this.controllers = controllers;
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

        app.use((req, res, next) => {
            console.debug(
                `[SimpleServer] call, url=${req.url},method=${req.method},params=${JSON.stringify(
                    req.params,
                )},query=${JSON.stringify(req.query)}`,
            );

            next();
        });

        this.controllers.forEach((controller: SimpleController) => {
            controller.register(app).then(() => {});
        });

        app.get("*", function (req, res) {
            return res.status(404).send(`404 error: not found: ${req.url}`);
        });

        app.listen(this.port, () => console.log(`Garden server listening on port ${this.port}!`));
    }
}
