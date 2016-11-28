var AMPParse = AMPParse || {};

AMPParse.buildMacro = function(hexadecimal) {

    if (!(hexadecimal instanceof AMPHexConsumer)) {
        throw new TypeError("Did not receive an AMPHexConsumer");
    }

    var nibblesConsumed = 0;
    var tempValue;
    var returnValue = {"type": "Managed Identifier"};

    try {
        tempValue = AMPParse.buildManagedIdentifier(hexadecimal);
        nibblesConsumed += tempValue.nibblesConsumed;
        returnValue.identifier = tempValue.returnValue;
    } catch(err) {
        err.message = "Failed to get the identifier for a macro: " + err.message;
        throw err;
    }

    if (returnValue.identifier.header.isParametrized) {
        var err = new Error("A macro identifier cannot contain parameterized OID");
        err.nibblesConsumed += nibblesConsumed;
        throw err;
    }


    var header = returnValue.identifier.header;
    if (returnValue.identifier.value.extraInfo === "Unknown OID") {
        if (header.hasIssuer === false) {
            var err = new Error("An externally defined macro must contain an issuer");
            err.nibblesConsumed += nibblesConsumed;
            throw err;
        }
    } else {
        if (header.hasIssuer || header.hasTag) {
            var err = new Error("A macro that is defined in an ADM must not have an" +
                " issuer field and must not have a tag field.")
            err.nibblesConsumed += nibblesConsumed;
            throw err;
        }
    }

    try {
        tempValue = AMPParse.buildMIDCollection(hexadecimal);
        nibblesConsumed += tempValue.nibblesConsumed;
        returnValue.value = tempValue.returnValue;
    } catch(err) {
        err.nibblesConsumed += nibblesConsumed;
        err.message = "Error getting the MID collection for a macro: " + err.message;
        throw err;
    }

    return {
        returnValue: returnValue,
        nibblesConsumed: nibblesConsumed
    }
};