import { listen } from "./index";
import { Schema } from "mongoose";

const connectionString = "mongodb://localhost:27017";

const port = 3721;

listen(connectionString, port, [
    {
        name: "note",
        schema: new Schema({
            title: String,
            body: String,
            date: {
                type: Date,
                default: Date.now,
            },
        }),
    },
]);
