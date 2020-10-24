import { SimpleDataProvider } from "../dataProviders/SimpleDataProvider";
import express from "express";
import { SimpleController } from "./SimpleController";
import { singular } from "pluralize";

export class SimpleDataProviderController implements SimpleController {
    dataProvider: SimpleDataProvider;

    constructor(dataProvider: SimpleDataProvider) {
        this.dataProvider = dataProvider;
    }

    private static getResource(req: any) {
        const { resources } = req.params;
        return singular(resources);
    }

    register(app: express.Express): void {
        app.get(`/:resources/getList`, async (req, res) => {
            const resource = SimpleDataProviderController.getResource(req);

            const { paging, ordering, filter } = req.query;
            const result = await this.dataProvider.getList(
                resource,
                {
                    pageSize: Number((paging as any).pageSize),
                    pageNum: Number((paging as any).pageNum),
                },
                {
                    key: String((ordering as any).key),
                    descending: (ordering as any).descending == "true",
                },
                filter,
            );
            return res.json(result);
        });

        app.get(`/:resources/getAll`, async (req, res) => {
            const resource = SimpleDataProviderController.getResource(req);

            const { ordering, filter } = req.query;
            const result = await this.dataProvider.getAll(
                resource,
                {
                    key: String((ordering as any).key),
                    descending: (ordering as any).descending == "true",
                },
                filter,
            );
            return res.json(result);
        });

        app.get(`/:resources/countOne`, async (req, res) => {
            const resource = SimpleDataProviderController.getResource(req);

            const { filter } = req.query;
            const result = await this.dataProvider.countOne(resource, filter);
            return res.json(result);
        });

        app.get(`/:resources/countMany`, async (req, res) => {
            const resource = SimpleDataProviderController.getResource(req);

            const { filters } = req.query;

            const keys = [...((filters as any)[Object.keys(filters as any)?.[0] ?? ""] as any[]).keys()];

            const filters1 = keys.map((index: number) => {
                const filter: any = {};

                Object.keys(filters as any).forEach((key) => {
                    filter[key] = ((filters as any)[key] as any)[index];
                });

                return filter;
            });

            const result = await this.dataProvider.countMany(resource, filters1);
            return res.json(result);
        });

        app.get(`/:resources/getOne`, async (req, res) => {
            const resource = SimpleDataProviderController.getResource(req);

            const { filter } = req.query;
            const result = await this.dataProvider.getOne(resource, filter);
            return res.json(result);
        });

        app.get(`/:resources/getMany`, async (req, res) => {
            const resource = SimpleDataProviderController.getResource(req);

            const { filters } = req.query;
            const result = await this.dataProvider.getMany(resource, filters as any);
            return res.json(result);
        });

        app.post(`/:resources/create`, async (req, res) => {
            const resource = SimpleDataProviderController.getResource(req);

            const { data } = req.body;
            const result = await this.dataProvider.create(resource, data);
            return res.json(result);
        });

        app.post(`/:resources/update`, async (req, res) => {
            const resource = SimpleDataProviderController.getResource(req);

            const { filter, data } = req.body;
            const result = await this.dataProvider.update(resource, filter, data);
            return res.json(result);
        });

        app.post(`/:resources/delete`, async (req, res) => {
            const resource = SimpleDataProviderController.getResource(req);

            const { filter } = req.body;
            await this.dataProvider.delete(resource, filter);
            return res.json({});
        });
    }
}
