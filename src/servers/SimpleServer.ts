import express from "express";
import cors from "cors";
import { SimpleController } from "../controllers/SimpleController";
import moment from "moment";
import { SimpleFormatting } from "../utils/SimpleFormatting";
import { createServer } from "http";
import { SocketIOServerHelper } from "../realtime/SocketIOServerHelper";
import { Socket } from "socket.io";

export class SimpleServer {
    static listen(
        controllers: SimpleController[],
        port: number,
        socketIOEventHandlers?: {
            name: string;
            action: (socket: Socket, params: any) => void;
        }[],
    ) {
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

        controllers.forEach((controller) => {
            controller.register(app);
        });

        const server = createServer(app);

        SocketIOServerHelper.registerServer(server, socketIOEventHandlers);

        server.listen(port, () => {
            const now = SimpleFormatting.toFormattedDateTimeString(moment());
            console.debug(`[${now} SimpleServer] listening: port=${port}`);
        });
    }
}
