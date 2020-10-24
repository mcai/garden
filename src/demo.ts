import { listen } from "./index";
import { Metrics } from "./math/Metrics";
import io from "socket.io-client";
import { SimpleFormatting } from "./utils/SimpleFormatting";
import moment from "moment";

const connectionString = "mongodb://localhost:27017";
const port = 3721;

const socket = io(`http://localhost:${port}`);

socket.on("disconnect", () => {
    console.log("a user disconnected");
});

socket.on("echo", (params: any) => {
    const now = SimpleFormatting.toFormattedDateTimeString(moment());
    console.log(
        `[${now} SimpleServer.DemoClient] socketio.onEcho: socket.id=${socket.id}, params=${JSON.stringify(params)}`,
    );
});

listen(connectionString, port, undefined, [
    {
        every: "* * * * *",
        name: "note.count",
        action: (dataProvider) => Metrics.count(dataProvider, "note", {}),
    },
    {
        every: "* * * * *",
        name: "socket.io.echo",
        action: (dataProvider) => {
            socket.emit("echo", "hello");
            return Promise.resolve(undefined);
        },
    },
]);
