var AMPParse = AMPParse || {};

AMPParse.buildTimestamp = function (hexadecimal)
{
	// Defensive programming
    if (typeof hexadecimal === "undefined" || typeof hexadecimal !== "string")
    {
	throw new ReferenceError("Provided parameter does not exist or is not a string");
    }

    //SDNV PARSER GOES HERE
    sdnvReturn = AMPParse.buildSdnv(hexadecimal);
    
    // Snag the relevant bytes and build return value object
    var ampEpoch = new Date(0);
    ampEpoch.setUTCSeconds(1347148800);

    var returnData = new Date(0);
    returnData.setUTCSeconds(sdnvReturn.returnValue.value);

    relative = false;
    if (returnData < ampEpoch) {
	relavite = true;
    }
    else {
	relative = false;
    }
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
