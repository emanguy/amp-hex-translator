class AMP_String {
    prettyValue: string;

    constructor(parserUtil: AMP_ParserUtil, size: number) {
        let rawValue = parserUtil.getRawHex(size)
        this.prettyValue = AMP_String.hexToString(rawValue);
    }

    static hexToString(value: string) {
        //TODO: convert hex to ascii
        return value;
    }
}