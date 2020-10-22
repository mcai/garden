import express from "express";

export interface SimpleController {
    register(app: express.Express): Promise<void>;
}
