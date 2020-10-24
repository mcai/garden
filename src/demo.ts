import { listen } from "./index";
import { SimpleFormatting } from "./utils/SimpleFormatting";
import moment from "moment";
import { SimpleDataProvider } from "./dataProviders/SimpleDataProvider";

const connectionString = "mongodb://localhost:27017";
const port = 3721;

async function count(dataProvider: SimpleDataProvider, resource: string, filter: any, action: any) {
    const count = await dataProvider.countOne(resource, filter);
    console.log(
        `[${SimpleFormatting.toFormattedDateTimeString(moment())} SimpleServer::${action.name}] every=${
            action.every
        }, resource=${resource}, filter=${JSON.stringify(filter)}, count=${count.data}`,
    );
}

listen(connectionString, port, undefined, [
    {
        every: "* * * * *",
        name: "note.count",
        action: (dataProvider) => count(dataProvider, "note", {}, {}),
    },
]);
