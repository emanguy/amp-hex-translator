var AMPParse = AMPParse || {};

AMPParse.buildString = function (hexadecimal) {
    nibblesUsed = 0; //int
    nullTerminate = false; //bool
    returnString = ""; //string
    tempChars = "00";
    
    // Defensive programming
    if (typeof hexadecimal === "undefined" || typeof hexadecimal !== "string") {
	throw new ReferenceError("Provided parameter does not exist or is not a string");
    }
    tempChars = hexadecimal.substring(0, 2);
    if (tempChars == "00") {
	throw new RangeError ("The provided hex is too short to contain a string");
    }

    // Find length of string
    while (!nullTerminate) {
	tempChars = hexadecimal.substring(nibblesUsed, nibblesUsed+2);
	if (tempChars != "00") {
 	    nibblesUsed++;
	    nibblesUsed++;
	    returnString += tempChars;
	}
	else {
	    nullTerminate = true;
	}
    }
    
    // Snag the relevant bytes and build return value object
    var returnValue = {
	type: "String",
	value: returnString
    };
    
    // Return object according to spec
    return {
	returnValue: returnValue,
	nibblesConsumed: nibblesUsed,
	trailingHex: hexadecimal.substring(nibblesUsed+2)
    };
}
