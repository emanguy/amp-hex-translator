class AMP_Byte {
    type: string = "Byte";
    value: number;
    constructor(parserUtil: AMP_ParserUtil) {
        this.value = parserUtil.getBytesAsInt(2);
    }
}