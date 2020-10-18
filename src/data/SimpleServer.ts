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

        app.use(express.json({ limit: "50mb" }));
        app.use(express.urlencoded({ limit: "50mb" }));

        app.use(cors());

        app.use((req, res, next) => {
            const path = req.path;
            const method = req.method;
            const params = JSON.stringify(req.params);
            const query = JSON.stringify(req.query);
            const body = JSON.stringify(req.body);
            console.debug(
                `[SimpleServer] call, path=${path},method=${method},params=${params},query=${query},body=${body}`,
            );

            next();
        });

        this.controllers.forEach((controller: SimpleController) => {
            controller.register(app).then(() => {});
        });

        // app.get("*", function (req, res) {
        //     return res.status(404).send(`404 error: not found: ${req.url}`);
        // });

        app.listen(this.port, () => console.log(`Garden server listening on port ${this.port}!`));
    }
}
