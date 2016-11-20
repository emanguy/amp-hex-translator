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

// TODO: remove this stub method when the real implementation is ready
AMPParse.buildObjectIdentifier = function(hexadecimal) {
    return {returnValue: {type: "Object Identifier"}};
}

// TODO: remove this stub method when the real implementation is ready
AMPParse.buildDataCollection = function(hexadecimal) {
    return {returnValue: {type: "Data Collection"}};
}