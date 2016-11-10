class AMP_MidCollection {
    type: string = "Mid Collection";
    numMids: number;
    mids: string[];

    constructor(parserUtil: AMP_ParserUtil) {
        this.mids = [];
        this.numMids = parserUtil.getBytesAsInt(2);
        for (let i = 0; i < this.numMids; i++) {
            let amp_mid = new AMP_MIDS(parserUtil);
            this.mids.push(amp_mid.midName);
        }
    }
}