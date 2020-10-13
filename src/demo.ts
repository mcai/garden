import { listen } from "./index";

const connectionString = "mongodb://localhost:27017";

const port = 3721;

listen(connectionString, port, [
    {
        name: "note",
        schemaDefinition: {
            title: String,
            body: String,
            date: {
                type: Date,
                default: Date.now,
            },
        },
    },
]);
