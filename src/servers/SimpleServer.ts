import express from "express";
import cors from "cors";
import { SimpleController } from "../controllers/SimpleController";
import moment from "moment";
import { SimpleFormatting } from "../utils/SimpleFormatting";

export class SimpleServer {
    port: number;
    controllers: SimpleController[];

    constructor(port: number, controllers: SimpleController[]) {
        this.port = port;
        this.controllers = controllers;
    }

    listen() {
        const app = express();

        app.use(express.json({ limit: "100mb" }));
        app.use(express.urlencoded({ limit: "100mb", extended: true }));

        app.use(cors());

        app.use((req, res, next) => {
            const path = req.path;
            const method = req.method;
            const params = JSON.stringify(req.params);
            const query = JSON.stringify(req.query);
            const body = JSON.stringify(req.body);
            const now = SimpleFormatting.toFormattedDateTimeString(moment());
            console.debug(
                `[${now} SimpleServer] call: path=${path},method=${method},params=${params},query=${query},body=${body}`,
            );

            next();
        });

        this.controllers.forEach((controller: SimpleController) => {
            controller.register(app).then(() => {});
        });

        app.listen(this.port, () => {
            const now = SimpleFormatting.toFormattedDateTimeString(moment());
            console.debug(`[${now} SimpleServer] listening: port=${this.port}`);
        });
    }
}
