import express from "express";

export interface SimpleHttpController {
    register(app: express.Express): void;
}
