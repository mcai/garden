import { SimpleDataProvider } from "../dataProviders/SimpleDataProvider";

export class Metrics {
    static async count(dataProvider: SimpleDataProvider, resource: string, filter: any): Promise<{ data: number }> {
        return await dataProvider.countOne(resource, filter);
    }
}
