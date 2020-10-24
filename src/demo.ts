import { listen } from "./index";
import { Metrics } from "./math/Metrics";
import io from "socket.io-client";

const connectionString = "mongodb://localhost:27017";
const port = 3721;

const socket = io(`http://localhost:${port}`);

socket.on("disconnect", () => {
    console.log("a user disconnected");
});

socket.on("chat", (msg: any) => {
    console.log(`chat: ${JSON.stringify(msg)}`);
});

listen(connectionString, port, undefined, [
    {
        every: "* * * * *",
        name: "note.count",
        action: (dataProvider) => Metrics.count(dataProvider, "note", {}),
    },
    {
        every: "* * * * *",
        name: "socket.io.test",
        action: (dataProvider) => {
            socket.emit("chat", "hello");
            return Promise.resolve(undefined);
        },
    },
]);
