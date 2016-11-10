class AMP_Parser {
    messageGroupHeader: MessageGroupHeader;
    messageHeaderByte: MessageHeaderByte;
    message: any;

    public parseHex(hexValue: string) {

        let parserUtil = new AMP_ParserUtil(hexValue);

        this.messageGroupHeader = new MessageGroupHeader(parserUtil);
        this.messageHeaderByte = new MessageHeaderByte(parserUtil);

        switch(this.messageHeaderByte.opcode) {
            case 0:
                this.message = new RegisterAgent(parserUtil);
                break;
            case 12:
                this.message = new DataReport(parserUtil);
                break;
            case 26:
                this.message = new PerformControl(parserUtil);
                break;
            default:
                throw new Error("Unsupported Opcode: " + this.messageHeaderByte.opcode);
        }

        return {"messageGroupHeader": this.messageGroupHeader, "messageHeaderByte": this.messageHeaderByte, "message": this.message};
    }
}