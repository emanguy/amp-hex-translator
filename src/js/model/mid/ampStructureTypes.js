var AMPParse = AMPParse || {};

AMPParse.getStructTypeFromId = function(structureId) {
    if (isNaN(structureId) || structureId < 0 || structureId > 25) {
        throw new ReferenceError("Invalid StructureId: " + structureId +
            " StructureId must be a number between 0 and 25");
    }

    var structureTypes = [
        {name: "Externally Defined Data", id: "EDD", enumeration: 0},
        {name: "Variable", id: "VAR", enumeration: 1},
        {name: "Report", id: "RPT", enumeration: 2},
        {name: "Control", id: "CTRL", enumeration: 3},
        {name: "State-Based Rule", id: "SRL", enumeration: 4},
        {name: "Time-Based Rule ", id: "TRL", enumeration: 5},
        {name: "Macro", id: "MACRO", enumeration: 6},
        {name: "Literal", id: "LIT", enumeration: 7},
        {name: "Operator", id: "OP", enumeration: 8},
        {name: "BYTE", id: "BYTE", enumeration: 9},
        {name: "Signed 32-bit Integer", id: "INT", enumeration: 10},
        {name: "Unsigned 32-bit Integer", id: "UINT", enumeration: 11},
        {name: "Signed 64-bit Integer", id: "VAST", enumeration: 12},
        {name: "Unsigned 64-bit Integer", id: "UVAST", enumeration: 13},
        {name: "Single-Precision Floating Point", id: "REAL32", enumeration: 14},
        {name: "Double-Precision Floating Point", id: "REAL64", enumeration: 15},
        {name: "Self-Delineating Numerical Value", id: "SDNV", enumeration: 16},
        {name: "Timestamp", id: "TS", enumeration: 17},
        {name: "Character String", id: "STR", enumeration: 18},
        {name: "Binary Large Object", id: "BLOB", enumeration: 19},
        {name: "Managed Identifier", id: "MID", enumeration: 20},
        {name: "MID Collection", id: "MC", enumeration: 21},
        {name: "Expression", id: "EXPR", enumeration: 22},
        {name: "Data Collection", id: "DC", enumeration: 23},
        {name: "Typed Data Collection", id: "TDC", enumeration: 24},
        {name: "Table", id: "TBL", enumeration: 25}
    ]

    return structureTypes[structureId];
}