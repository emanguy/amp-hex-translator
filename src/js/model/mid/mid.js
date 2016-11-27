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

AMPParse.buildManagedIdentifier = function(hexadecimal) {

    if (!(hexadecimal instanceof AMPHexConsumer)) {
        throw new TypeError("Did not receive an AMPHexConsumer");
    }

    var nibblesConsumed = 0;

    try {

        // Define return value now so we can add optional properties as necessary
        var returnValue = {"type": "Managed Identifier"};

        var header = AMPParse.buildMidFlag(hexadecimal);
        nibblesConsumed += header.nibblesConsumed;
        returnValue.header = header.returnValue;

        if (header.returnValue.hasIssuer) {
            var issuer = AMPParse.buildSdnv(hexadecimal);
            nibblesConsumed += issuer.nibblesConsumed;
            returnValue.issuer = issuer.returnValue;
        }

        var value = AMPParse.buildOid(hexadecimal, header.returnValue.isCompressed);
        nibblesConsumed += value.nibblesConsumed;
        returnValue.value = value.returnValue;

        if (header.returnValue.isParametrized) {
            var parameters = AMPParse.buildDataCollection(hexadecimal, true);
            nibblesConsumed += parameters.nibblesConsumed;
            returnValue.parameters = parameters.returnValue;
        }

        if (header.returnValue.hasTag) {
            var tag = AMPParse.buildSdnv(hexadecimal);
            nibblesConsumed += tag.nibblesConsumed;
            returnValue.tag = tag.returnValue;
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
        throw new TypeError("Did not receive an AMPHexConsumer");
    }

    hexadecimal.consumeNibbles();
    var byteValue = hexadecimal.consumedHexInt;

    var OID = (byteValue & 192) >> 6;
    var hasTag = ((byteValue & 32) >> 5) === 1;
    var hasIssuer = ((byteValue & 16) >> 4) === 1;

    var structureId = byteValue & 15;

    var isParametrized = (OID & 1) === 1;
    var isCompressed = (OID & 2) === 2;

    var returnValue = {
        isCompressed: isCompressed,
        isParametrized: isParametrized,
        hasTag: hasTag,
        hasIssuer: hasIssuer,
        enclosedStructId: AMPParse.getStructTypeFromId(structureId)
    }

    return {
        returnValue: returnValue,
        nibblesConsumed: 2
    }

}

AMPParse.getStructTypeFromId = function(structureId) {
    if (isNaN(structureId)) {
        throw new TypeError("Structure ID must be between 0 and 8.  Structure Id " + structureId + " is invalid");
    } else if(structureId < 0 || structureId > 8) {
        throw new RangeError("Structure ID must be between 0 and 8.  Structure Id " + structureId + " is invalid");
    }

    var structureTypes = [
        "Externally Defined Data",
        "Variable",
        "Report",
        "Control",
        "State-Based Rule",
        "Time-Based Rule ",
        "Macro",
        "Literal",
        "Operator"
    ]

    return structureTypes[structureId];
}