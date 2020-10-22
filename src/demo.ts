import { listen } from "./index";

const connectionString = "mongodb://localhost:27017";
const port = 3721;

listen(connectionString, port);
