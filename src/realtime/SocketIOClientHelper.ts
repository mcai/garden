import io from "socket.io-client";
import { SimpleFormatting } from "../utils/SimpleFormatting";
import moment from "moment";
import Socket = SocketIOClient.Socket;

export class SocketIOClientHelper {
    static createClient(
        serverHost: string,
        port: number,
        socketIOEventHandlers?: {
            name: string;
            action: (socket: Socket, params: any) => void;
        }[],
    ): Socket {
        const socket = io(`http://${serverHost}:${port}`);

        socket.on("disconnect", () => {
            this.onDisconnect(socket);
        });

        socket.on("echo", (params: any) => {
            this.onEcho(socket, params);
        });

        socketIOEventHandlers?.forEach((eventHandeler) => {
            socket.on(eventHandeler.name, (params: any) => {
                eventHandeler.action(socket, params);
            });
        });

        return socket;
    }

    private static onDisconnect(socket: Socket) {
        const now = SimpleFormatting.toFormattedDateTimeString(moment());
        console.log(`[${now} SimpleServer] socketio.client.onDisconnect`);
    }

    private static onEcho(socket: Socket, params: any) {
        const now = SimpleFormatting.toFormattedDateTimeString(moment());
        console.log(`[${now} SimpleServer] socketio.client.onEcho: params=${JSON.stringify(params)}`);
        socket.emit("echo", params);
    }
}
