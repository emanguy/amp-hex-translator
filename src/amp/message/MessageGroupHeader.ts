class MessageGroupHeader {
    numMessages: number;
    timestamp: AMP_Timestamp;
    trailingHex: string;

    constructor(parserUtil: AMP_ParserUtil) {
        this.numMessages = parserUtil.getBytesAsInt(2);
        this.timestamp = new AMP_Timestamp(parserUtil);
    }
}