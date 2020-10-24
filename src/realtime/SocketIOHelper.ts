import SocketIO, { Socket } from "socket.io";
import { SimpleFormatting } from "../utils/SimpleFormatting";
import moment from "moment";
import { Server } from "http";

export class SocketIOHelper {
    static register(server: Server) {
        const io = new SocketIO(server);

        io.on("connection", (socket) => {
            this.onConnection(socket);

            socket.on("disconnect", () => {
                this.onDisconnect(socket);
            });

            socket.on("chat", (params) => {
                this.onChat(socket, params);
            });
        });
    }

    private static onConnection(socket: Socket) {
        const now = SimpleFormatting.toFormattedDateTimeString(moment());
        console.log(
            `[${now} SimpleServer] socketio.onConnection: socket.id=${socket.id}, socket.conn.remoteAddress=${socket.conn.remoteAddress}`,
        );
    }

    private static onDisconnect(socket: Socket) {
        const now = SimpleFormatting.toFormattedDateTimeString(moment());
        console.log(`[${now} SimpleServer] socketio.onDisconnect: socket.id=${socket.id}`);
    }

    private static onChat(socket: Socket, params: any) {
        const now = SimpleFormatting.toFormattedDateTimeString(moment());
        console.log(`[${now} SimpleServer] socketio.onChat: socket.id=${socket.id}, params=${JSON.stringify(params)}`);
        socket.emit("chat", params);
    }
}
