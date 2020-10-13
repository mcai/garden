import express from "express";
import cors from "cors";
import { SimpleHttpController } from "./SimpleHttpController";

export class SimpleHttpServer {
    port: number;
    controllers: SimpleHttpController[];

    constructor(port: number, controllers: SimpleHttpController[]) {
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

        this.controllers.forEach((controller: SimpleHttpController) => {
            controller.register(app);
        });

        app.get("*", function (req, res) {
            return res.status(404).send(`404 error: not found: ${req.url}`);
        });

        app.listen(this.port, () => console.log(`Garden server listening on port ${this.port}!`));
    }
}
