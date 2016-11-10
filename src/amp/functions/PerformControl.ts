class PerformControl {
    start: number;
    midCount: number;
    control: string;
    parameters: any;

    constructor(parserUtil: AMP_ParserUtil) {
        this.start = parserUtil.getBytesAsInt(2);
        this.midCount = parserUtil.getBytesAsInt(2);
        this.control = ControlsUtil.getControlName(parserUtil);
        this.parameters = new AMP_TypedDataCollection(parserUtil);
    }
}