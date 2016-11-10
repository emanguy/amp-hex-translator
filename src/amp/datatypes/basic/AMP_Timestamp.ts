class AMP_Timestamp {
    value: string;

    constructor(parseUtils: AMP_ParserUtil) {
        let rawInt = parseUtils.getBytesAsInt(10)
        this.value = AMP_Timestamp.hexToTimestamp(rawInt);
    }

    static hexToTimestamp(rawTimestamp: number): string {
        if (rawTimestamp < 1347148800) {
            rawTimestamp += new Date().getTime();
        } else {
            rawTimestamp;
        }

        try {
            let date = new Date(rawTimestamp);
            return date.toISOString();
        } catch (e) {
            throw new Error("Could not convert " + rawTimestamp + " to a date");
        }
    }
}