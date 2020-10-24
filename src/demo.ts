import { listen } from "./index";
import { SimpleMongoDbDataProvider } from "./dataProviders/SimpleMongoDbDataProvider";
import { SimpleCronPlanScheduler } from "./plans/SimpleCronPlanScheduler";
import { SimpleFormatting } from "./utils/SimpleFormatting";
import moment from "moment";

const connectionString = "mongodb://localhost:27017";
const port = 3721;

const dataProvider = new SimpleMongoDbDataProvider(connectionString);

dataProvider.connect().then(() => {
    const scheduler = new SimpleCronPlanScheduler();

    scheduler.register("count", async ({ resource, filter }) => {
        const count = await dataProvider.countOne(resource, filter);
        console.log(
            `[${SimpleFormatting.toFormattedDateTimeString(
                moment(),
            )} count] resource=${resource}, filter=${JSON.stringify(filter)}, count=${count.data}`,
        );
    });

    scheduler.schedule("* * * * *", "count", {
        resource: "note",
        filter: {},
    });

    scheduler.start();

    listen(connectionString, port);
});
