var AMPParse = AMPParse || {};

AMPParse.buildMIDCollection = function(hexadecimal)
{

    if ( !(hexadecimal instanceof AMPHexConsumer) )
    {
        throw new TypeError("Did not receive an AMPHexConsumer");
    }

    var nibblesUsed = 0;

    var midCount;
    try {
        midCount = AMPParse.buildBasicNumber(hexadecimal, "Integer", true);
        nibblesUsed += midCount.nibblesConsumed;
        midCount = parseInt(midCount.returnValue.value);
    } catch (err) {
        err.nibblesConsumed += nibblesUsed;
        err.message = "Failed to get number of MIDs for MID Collection: " + err.message;
        throw err;
    }

    var mids = [];
    for (var i = 0; i < midCount; i++) {
        try {
            var mid = AMPParse.buildManagedIdentifier(hexadecimal);
            nibblesUsed += mid.nibblesConsumed;
            mids.push(mid.returnValue);
        } catch (err) {
            // RangeError indicates there were not enough bytes to create the expected amount of MIDs
            if (err instanceof RangeError) {
                err.message = "Expected " + midCount + " MIDs but there were only" +
                    " enough bytes for " + i;
            } else {
                err.messsage = "Failed to build MID in MID Collection: " + err.message;
            }

            err.nibblesConsumed = nibblesUsed;
            throw err;
        }
    }

    var returnValue = {
        type: "Managed Identifier Collection",
        value: mids
    }

    return {
        returnValue: returnValue,
        nibblesConsumed: nibblesUsed
    }

}