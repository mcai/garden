import express from "express";
import { SimpleController } from "./SimpleController";
import { singular } from "pluralize";
import { SimpleFileProvider } from "../fileProviders/SimpleFileProvider";
import { UploadedFile } from "express-fileupload";

export class SimpleFileProviderController implements SimpleController {
    fileProvider: SimpleFileProvider;

    constructor(fileProvider: SimpleFileProvider) {
        this.fileProvider = fileProvider;
    }

    private static getBucket(req: any) {
        const { bucket } = req.params;
        return singular(bucket);
    }

    register(app: express.Express): void {
        app.get(`/buckets/:bucket/getOne`, async (req, res) => {
            const bucket = SimpleFileProviderController.getBucket(req);

            const { key } = req.query;
            const result = await this.fileProvider.getOne(bucket, key as any);
            return res.json(result);
        });

        app.get(`/buckets/:bucket/downloadAsBase64Image`, async (req, res) => {
            const bucket = SimpleFileProviderController.getBucket(req);

            const { key } = req.query;
            const result = await this.fileProvider.getOne(bucket, key as any);

            const img = Buffer.from(result.data, "base64");

            res.writeHead(200, {
                "Content-Type": "image/jpeg",
                "Content-Length": img.length,
            });

            res.end(img);
        });

        app.post(`/buckets/:bucket/create`, async (req, res) => {
            const bucket = SimpleFileProviderController.getBucket(req);

            const { key, data } = req.body;

            const result = await this.fileProvider.create(bucket, key, new Buffer(data));
            return res.json(result);
        });

        app.post(`/buckets/:bucket/upload`, async (req, res) => {
            const bucket = SimpleFileProviderController.getBucket(req);

            const { key } = req.body;

            const file = req.files?.file as UploadedFile;

            await this.fileProvider.create(bucket, key, file.data);
            return res.json({});
        });

        app.post(`/buckets/:bucket/delete`, async (req, res) => {
            const bucket = SimpleFileProviderController.getBucket(req);

            const { key } = req.body;
            await this.fileProvider.delete(bucket, key);
            return res.json({});
        });
    }
}
