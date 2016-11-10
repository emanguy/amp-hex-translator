class AMP_TypedDataCollection {
    numBlobs: number;
    typeBlob: number[];
    blobs: any[];

    constructor(parserUtil: AMP_ParserUtil) {
        this.typeBlob = [];
        this.blobs = [];
        this.numBlobs = parserUtil.getBytesAsInt(2);

        let numTypes = parserUtil.getBytesAsInt(2);


        for (let i = 0; i < numTypes; i++) {
            this.typeBlob[i] = parserUtil.getBytesAsInt(2);
        }

        for (let i = 0; i < this.typeBlob.length; i++) {
            //TODO: should this be used to validate something
            let blobSize = parserUtil.getBytesAsInt(2);
            console.log("Blog size is " + blobSize);
            this.blobs.push(parserUtil.getType(this.typeBlob[i]));
        }
    }
}