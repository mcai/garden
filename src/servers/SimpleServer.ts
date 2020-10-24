import express from "express";
import cors from "cors";
import { SimpleController } from "../controllers/SimpleController";
import moment from "moment";
import { SimpleFormatting } from "../utils/SimpleFormatting";
import { createServer } from "http";
import SocketIO from "socket.io";

export class SimpleServer {
    static listen(controller: SimpleController, port: number) {
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

        controller.register(app);

        const server = createServer(app);

        const io = new SocketIO(server);

        io.on("connection", (socket) => {
            console.log("a user connected");

            socket.on("disconnect", () => {
                console.log("a user disconnected");
            });

            socket.on("chat", (msg) => {
                console.log(`echo: ${JSON.stringify(msg)}`);
                socket.emit("chat", msg);
            });
        });

        server.listen(port, () => {
            const now = SimpleFormatting.toFormattedDateTimeString(moment());
            console.debug(`[${now} SimpleServer] listening: port=${port}`);
        });
    }
}
