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

        this.controllers.forEach((controller: SimpleController) => {
            controller.register(app);
        });

        app.get("*", function (req, res) {
            return res.status(404).send(`404 error: not found: ${req.url}`);
        });

        app.listen(this.port, () => console.log(`Garden server listening on port ${this.port}!`));
    }
}
