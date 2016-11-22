/*
{
    "type": "Managed Identifier",
    "header": {

    },
    "issuer": {"type": "Sdnv", ...},
    "value": { "type": "Object Identifier", ... },
    "parameters": { "type": "Data Collection", ...}, // The typed data collection containing the parameters
    "tag": {"type": "Sdnv", ...}
}
*/

var AMPParse = AMPParse || {};

AMPParse.buildMid = function(hexadecimal) {

    if (!(hexadecimal instanceof AMPHexConsumer)) {
        throw new ReferenceError("Did not receive an AMPHexConsumer");
    }

    var nibblesConsumed = 0;

    try {

        // Define return value now so we can add optional properties as necessary
        var returnValue = {"type": "Managed Identifier"};

        var header = AMPParse.buildMidFlag(hexadecimal);
        nibblesConsumed += header.nibblesConsumed;
        returnValue.header = header;

        if (header.returnValue.hasIssuer) {
            var issuer = AMPParse.buildSdnv(hexadecimal);
            nibblesConsumed += issuer.nibblesConsumed;
            returnValue.issuer = issuer;
        }

        var value = AMPParse.buildObjectIdentifier(hexadecimal);
        nibblesConsumed += value.nibblesConsumed;
        returnValue.value = value;

        var parameters = AMPParse.buildDataCollection(hexadecimal);
        nibblesConsumed += parameters.nibblesConsumed;
        returnValue.parameters = parameters;

        if (header.returnValue.hasTag) {
            var tag = AMPParse.buildSdnv(hexadecimal);
            nibblesConsumed += tag.nibblesConsumed;
            returnValue.tag = tag;
        }

    } catch (err) {
        err.nibblesConsumed += nibblesConsumed;
        throw err;
    }

    return {
        returnValue: returnValue,
        nibblesConsumed: nibblesConsumed
    }
}

AMPParse.buildMidFlag = function(hexadecimal) {

    if (!(hexadecimal instanceof AMPHexConsumer)) {
        throw new ReferenceError("Did not receive an AMPHexConsumer");
    }

    hexadecimal.consumeNibbles();
    var byteValue = hexadecimal.consumedHexInt;

    var OID = (byteValue & 192) >> 6;
    var hasTag = ((byteValue & 32) >> 5) === 1;
    var hasIssuer = ((byteValue & 16) >> 4) === 1;

    // TODO: verify this is right, sturctures go up to 25 so why only 4 bits?
    var structureId = byteValue & 15;

    var isCompressed, isParametrized = false;

    switch(OID) {
        case 0:
            isParametrized = false;
            isCompressed = false;
            break;
        case 1:
            isParametrized = true;
            isCompressed = false;
            break;
        case 2:
            isParametrized = false;
            isCompressed = true;
            break;
        case 3:
            isParametrized = true;
            isCompressed = true;
            break;
        default:
            throw new ReferenceError("Invalid OID was present in the MID Flag");
    }

    var returnValue = {
        isCompressed: isCompressed,
        isParametrized: isParametrized,
        hasTag: hasTag,
        hasIssuer: hasIssuer,
        enclosedStructId: AMPParse.getStructTypeFromId(structureId).name
    }

    return {
        returnValue: returnValue,
        nibblesConsumed: 2
    }

}

AMPParse.getStructTypeFromId = function(structureId) {
    if (isNaN(structureId) || structureId < 0 || structureId > 8) {
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
        {name: "Operator", id: "OP", enumeration: 8}
    ]

    return structureTypes[structureId];
}

// TODO: remove this stub method when the real implementation is ready
AMPParse.buildObjectIdentifier = function(hexadecimal) {
    return {returnValue: {type: "Object Identifier"}};
}

// TODO: remove this stub method when the real implementation is ready
AMPParse.buildDataCollection = function(hexadecimal) {
    return {returnValue: {type: "Data Collection"}};
}