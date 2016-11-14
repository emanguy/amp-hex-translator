var AMPParse = AMPParse || {};

AMPParse.buildTimestamp = function (hexadecimal)
{
	// Defensive programming
    if (typeof hexadecimal === "undefined" || typeof hexadecimal !== "string")
    {
	throw new ReferenceError("Provided parameter does not exist or is not a string");
    }

    // TODO: Call SDNV parser to get true value
    sdnvReturn = atoi(hexadecimal);
    
    // Snag the relevant bytes and build return value object
    var ampEpoch = new Data(0);
    ampEpoch.setUTCSeconds(1347148800);

    var returnData = new Data(0);
    returnData.setUTCSeconds(sdnvReturn);

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
    
    // Make the binary representation and append prefix
    for (var i = 0; i < 8; i++)
    {
	returnValue.binaryValue = ( rawValue & 1 ).toString() + returnValue.binaryValue;
	rawValue = rawValue >>> 1;
    }
    
    returnValue.binaryValue = "0b" + returnValue.binaryValue;
    
    // Return object according to spec
    return {
	returnValue: returnValue,
	nibblesConsumed: 2,
	trailingHex: hexadecimal.substring(2)
    };
}
