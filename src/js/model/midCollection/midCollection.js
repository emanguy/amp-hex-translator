var AMPParse = AMPParse || {};

AMPParse.buildMIDCollection = function(hexadecimal)
{

    if ( !(hexadecimal instanceof AMPHexConsumer) )
    {
        throw new ReferenceError("Did not receive an AMPHexConsumer");
    }

    var nibblesUsed = 0;
    var midCountObj = AMPParse.buildBasicNumber(hexadecimal, "Integer", true);
    var midCount = parseInt(midCountObj.returnValue.value);
    nibblesUsed += midCountObj.nibblesConsumed;

    var count = 0;
    var mids = [];
    for (var i = 0; i < midCount; i++) {
        try {
            var mid = AMPParse.buildMid(hexadecimal);
            nibblesUsed += mid.nibblesConsumed;
            mids.push(mid);
        } catch (err) {
            // RangeError indicates there were not enough bytes to create the expected amount of MIDs
            if (err instanceof RangeError) {
                err.message = "Expected " + midCount + " MIDs but there were only" +
                    " enough bytes for " + i;
            }

            err.nibblesConsumed = nibblesUsed;
            throw err;
        }
    }

    var returnValue = {
        type: "Managed Identifier Collection",
        midCount: midCount,
        value: mids
    }

    return {
        returnValue: returnValue,
        nibblesConsumed: nibblesUsed
    }

}