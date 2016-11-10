class AMP_MIDS {

    midName: string;

    constructor(parserUtil: AMP_ParserUtil) {
        let intValue = parserUtil.getBytesAsInt(8);
        this.midName = AMP_MIDS.getName(intValue);
    }

    static getName(intValue: number): string {
        switch(intValue) {
            // EDD types
            case 0x80010100:
                return "Num Reports";
            case 0x80010101:
                return "Sent Reports";
            case 0x80010102:
                return "Num TRL";
            case 0x80010103:
                return "Run TRL";
            case 0x80010104:
                return "Num SRL";
            case 0x80010105:
                return "Run SRL";
            case 0x80010106:
                return "Num Lit";
            case 0x80010107:
                return "Num Variables";
            case 0x80010108:
                return "Num Macros";
            case 0x80010109:
                return "Run Macros";
            case 0x8001010A:
                return "Num Controls";
            case 0x8001010B:
                return "Run Controls";
            case 0x8001010C:
                return "Current Time";
            // Report Templates
            case 0x82030100:
                return "Full Report";
            default:
                throw new Error("Unknow MID " + intValue + "(" + intValue.toString(16) + ")");
        }
    }
}