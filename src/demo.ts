import { listen } from "./index";
import { Metrics } from "./math/Metrics";

const connectionString = "mongodb://localhost:27017";
const port = 3721;

listen(connectionString, port, undefined, [
    {
        every: "* * * * *",
        name: "note.count",
        action: (dataProvider) => Metrics.count(dataProvider, "note", {}),
    },
]);
