import { SimpleDataProvider } from "../dataProviders/SimpleDataProvider";
import { SimpleFormatting } from "../utils/SimpleFormatting";
import moment from "moment";

export class Metrics {
    static async count(dataProvider: SimpleDataProvider, resource: string, filter: any) {
        const count = await dataProvider.countOne(resource, filter);
        console.log(
            `[${SimpleFormatting.toFormattedDateTimeString(
                moment(),
            )} SimpleServer::count] resource=${resource}, filter=${JSON.stringify(filter)}, count=${count.data}`,
        );
    }
}
