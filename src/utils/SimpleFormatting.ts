import { Moment } from "moment";

export class SimpleFormatting {
    static toFormattedDateTimeString(moment: Moment): string {
        return moment.format("YYYY-MM-DD HH:mm:ss");
    }

    static toFormattedDateTimeStringAsFileName(moment: Moment): string {
        return moment.format("YYYY-MM-DD_HH-mm-ss");
    }

    static toFormattedDateString(moment: Moment): string {
        return moment.format("YYYY-MM-DD");
    }
}
