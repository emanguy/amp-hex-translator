class AMP_Blob {
    type: string = "Blob";
    numBytes: number;
    bytes: AMP_Byte[];

    constructor(parserUtil: AMP_ParserUtil) {
        this.numBytes = parserUtil.getBytesAsInt(2);
        this.bytes = [];
        for (let i=0; i < this.numBytes; i++) {
            this.bytes[i] = new AMP_Byte(parserUtil);
        }
    }

    static hexToBlob(value: string) {
        //TODO: convert hex to ascii
        return value;
    }
}