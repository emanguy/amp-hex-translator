class ControlsUtil {

    static getControlName(parseUtils: AMP_ParserUtil): string {
        let control = parseUtils.getBytesAsInt(8);
        switch(control) {
            case 0x83040100:
                return "ListADMs";
            case 0xC3040101:
                return "AddVar";
            case 0xC3040102:
                return "DelVar";
            case 0xC3040103:
                return "ListVars";
            case 0xC3040104:
                return "DescVars";
            case 0xC3040105:
                return "AddRptTpl";
            case 0xC3040106:
                return "DelRptTpl";
            case 0xC3040107:
                return "ListRptTpls";
            case 0xC3040108:
                return "DescRptTpls";
            case 0xC3040109:
                return "GenerateRpts";
            case 0xC304010A:
                return "AddMacro";
            case 0xC304010B:
                return "DelMacro";
            case 0xC304010C:
                return "ListMacros";
            case 0xC304010D:
                return "DescMacros";
            case 0xC304010E:
                return "AddTRL";
            case 0xC304010F:
                return "DelTRL";
            case 0xC3040110:
                return "ListTRLs";
            case 0xC3040111:
                return "DescTRLs";
            case 0xC3040112:
                return "AddSRl";
            case 0xC3040113:
                return "DelSRL";
            case 0xC3040114:
                return "ListSRLs";
            case 0xC3040115:
                return "DescSRLs";
            case 0xC3040116:
                return "StoreVal";
            case 0xC3040117:
                return "ResetCounts";
            default:
                throw new Error("Unrecognized control type: " + control);
        }
    }
}