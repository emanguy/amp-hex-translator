var AMPParse = AMPParse || {};

AMPParse.buildTimestamp = function (hexadecimal)
{
	// Defensive programming
    if (!(hexadecimal instanceof AMPHexConsumer)) {
		throw new ReferenceError("Provided parameter does not exist or is not an AMPHexConsumer");
    }

    //SDNV PARSER GOES HERE
    sdnvReturn = AMPParse.buildSdnv(hexadecimal);

    if (sdnvReturn.nibblesConsumed < 1) {
        throw new RangeError("Provided parameter is of too small a size");
    }
    
    // Snag the relevant bytes and build return value object
    var ampEpoch = new Date(0);
    ampEpoch.setUTCSeconds(1347148800);

    var returnData = new Date(0);
    returnData.setUTCSeconds(sdnvReturn.returnValue.value);

    relative = returnData.getTime() < ampEpoch.getTime();

    var returnValue = {
	type: "Timestamp",
	value: returnData,
	isRelative: relative
    };
    
    // Return object according to spec
    return {
	returnValue: returnValue,
	nibblesConsumed: sdnvReturn.nibblesConsumed,
	trailingHex: sdnvReturn.trailingHex
    };
}
