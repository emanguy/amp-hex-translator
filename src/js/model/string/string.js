var AMPParse = AMPParse || {};

AMPParse.buildString = function (hexadecimal) {
    
    nibblesUsed = 0; //int
    returnString = ""; //string
    tempChars = "00";
    
    // Defensive programming
    if ( !(hexadecimal instanceof AMPHexConsumer) ) {
		throw new ReferenceError("");
    }
    
	while (!hexadecimal.isEmpty && hexadecimal.consumeNibbles() !== "00")
	{
		// Check for bad data
		if (hexadecimal.consumedHexInt > 127)
		{
			var err = new ReferenceError("Provided parameter contains a char of value greater than 127");
			err.nibblesConsumed = nibblesUsed;
			throw err;
		}

		returnString += String.fromCharCode(hexadecimal.consumedHexInt);
		nibblesUsed += 2; // This counts every character read
	}

    if (hexadecimal.consumedHex !== "00") {
    	throw new RangeError("Provided parameter does not null terminate");
    }

	// This includes the null terminator
	nibblesUsed += 2;

    // Snag the relevant bytes and build return value object
    var returnValue = {
		type: "String",
		value: returnString
    };
    
    // Return object according to spec
    return {
		returnValue: returnValue,
		nibblesConsumed: nibblesUsed
    };
}
