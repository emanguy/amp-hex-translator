class AMP_ParserUtil {
    hexValue: string;

    constructor(hexValue: string) {
        this.hexValue = hexValue.toUpperCase();
        // Remove the prefix if it is there
        if (this.hexValue.substr(0, 2) == "0X") {
            this.hexValue = this.hexValue.substr(2);
        }

        this.validateHexValues();

    }

    validateHexValues() {
        let validateHex = new RegExp("^[0-9A-F]+$");
        if (!validateHex.test(this.hexValue)) {
            throw new Error("Invalid characters found");
        }
    }

    getRawHex(size: number): string {
        if (this.hexValue.length < size) {
            throw new Error("Cannot get converted value from " + this.hexValue);
        }

        let rawValue = this.hexValue.substr(0, size);
        this.hexValue = this.hexValue.substr(size);
        return rawValue;
    }

    getBytesAsInt(size: number) {
        let valueInt = parseInt(this.getRawHex(size), 16);

        if (isNaN(valueInt)) {
            throw new Error("Could not convert " + valueInt + " to an integer");
        }

        return valueInt;
    }

    getType(type: number): any {
        switch (type) {
            case AMP_DataTypes.EXTERNAL_DEFINED_DATA:
                break;
            case AMP_DataTypes.VARIABLE:
                break;
            case AMP_DataTypes.REPORT:
                break;
            case AMP_DataTypes.CONTROL:
                break;
            case AMP_DataTypes.STATE_BASED_RULE:
                break;
            case AMP_DataTypes.TIME_BASED_RULE:
                break;
            case AMP_DataTypes.MACRO:
                break;
            case AMP_DataTypes.LITERAL:
                break;
            case AMP_DataTypes.OPERATOR:
                break;
            case AMP_DataTypes.BYTE:
                break;
            case AMP_DataTypes.INT:
                break;
            case AMP_DataTypes.UINT:
                break;
            case AMP_DataTypes.VAST:
                break;
            case AMP_DataTypes.UVAST:
                break;
            case AMP_DataTypes.REAL32:
                break;
            case AMP_DataTypes.REAL64:
                break;
            case AMP_DataTypes.SDNV:
                break;
            case AMP_DataTypes.TS:
                break;
            case AMP_DataTypes.STR:
                break;
            case AMP_DataTypes.BLOB:
                break;
            case AMP_DataTypes.MID:
                break;
            case AMP_DataTypes.MC:
                return new AMP_MidCollection(this);
            case AMP_DataTypes.EXPR:
                break;
            case AMP_DataTypes.DC:
                return new AMP_DataCollection(this);
            case AMP_DataTypes.TDC:
                return new AMP_TypedDataCollection(this);
            case AMP_DataTypes.TBL:
                break;
            default:
                throw new Error("Unsupported value: " + type);
        }
    }
}
