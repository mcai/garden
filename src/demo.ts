import { listen } from "./index";
import { Metrics } from "./math/Metrics";
import { SocketIOClientHelper } from "./realtime/SocketIOClientHelper";
import { CronHelper } from "./cron/CronHelper";

const connectionString = "mongodb://localhost:27017";
const port = 3721;

const socket = SocketIOClientHelper.createClient("localhost", port);

listen(connectionString, port, undefined, undefined, [
    {
        every: CronHelper.everyMinute,
        name: "note.count",
        action: (dataProvider) => Metrics.count(dataProvider, "note", {}),
    },
    {
        every: CronHelper.everyMinute,
        name: "socket.io.echo",
        action: (dataProvider) => {
            socket.emit("echo", "hello");
            return Promise.resolve(undefined);
        },
    },
]);
