class AMP_DataCollection {
    type: string = "Data Collection";
    numBlobs: number;
    blobs: any[];

    constructor(parserUtil: AMP_ParserUtil) {
        this.blobs = [];
        this.numBlobs = parserUtil.getBytesAsInt(2);

        for (let i = 0; i < this.numBlobs; i++) {
            this.blobs.push(new AMP_Blob(parserUtil));
        }
    }
}