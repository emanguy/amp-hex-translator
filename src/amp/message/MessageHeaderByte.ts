class MessageHeaderByte {
    acl: number;
    nack: number;
    ack: number;
    opcode: number;

    constructor(parserUtil: AMP_ParserUtil) {
        let rawInt = parserUtil.getBytesAsInt(2)

        this.acl = rawInt & 128;
        this.nack = rawInt & 64;
        this.ack = rawInt & 32;
        this.opcode = rawInt & 31;
    }
}