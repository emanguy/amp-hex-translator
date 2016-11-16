var AMPParse = AMPParse || {};

AMPParse.buildString = function (hexadecimal) {
    
    nibblesUsed = 0; //int
    nullTerminate = false; //bool
    noNull = false; //bool
    badData = false; //bool
    returnString = ""; //string
    tempChars = "00";
    
    // Defensive programming
    if (typeof hexadecimal !== "string") {
		throw new ReferenceError("Provided parameter does not exist or is not a string");
    }
    tempChars = hexadecimal.substring(0, 2);
    if (tempChars == "00") {
		nullTerminate = true;
		returnString = "";
    }

    // Find length of string
    while (!nullTerminate) {
    	if (nibblesUsed > (hexadecimal.length)) {
    		nullTerminate = true;
    		noNull = true;
    	}
		tempChars = hexadecimal.substring(nibblesUsed, nibblesUsed+2);
		if (tempChars != "00") {
 	    	nibblesUsed++;
		    nibblesUsed++;
		    if (parseInt(tempChars, 16) > 127) {
		    	nullTerminate = true;
		    	badData = true;
		    }
	    	returnString += String.fromCharCode(parseInt(tempChars, 16));
		}
		else {
	    	nullTerminate = true;
		}
    }
    
    if (noNull) {
    	throw new RangeError("Provided parameter does not null terminate");
    }
    if (badData) {
    	throw new ReferenceError("Provided parameter contains a char of value greater than 127");
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
