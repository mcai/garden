import { Schema } from "mongoose";

export interface SimpleResource {
    name: string;
    schema: Schema;
}
