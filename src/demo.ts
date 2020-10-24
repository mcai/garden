import { listen } from "./index";
import { Metrics } from "./math/Metrics";
import { SocketIOClientHelper } from "./realtime/SocketIOClientHelper";

const connectionString = "mongodb://localhost:27017";
const port = 3721;

const socket = SocketIOClientHelper.createClient("localhost", port);

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
