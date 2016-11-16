var AMPParse = AMPParse || {};

AMPParse.buildByte = function (hexadecimal)
{
	// Defensive programming
	if (typeof hexadecimal !== "string")
	{
		throw new ReferenceError("Provided parameter does not exist or is not a string");
	}
	if (hexadecimal.length < 2 || hexadecimal.length % 2 !== 0)
	{
		throw new RangeError("The provided hex is too short to contain a byte or is misaligned.");
	}

	// Snag the relevant bytes and build return value object
	var byteChars = hexadecimal.substring(0, 2);
	var rawValue = parseInt(byteChars, 16);
	var returnValue = {
		type: "Byte",
		value: rawValue,
		binaryValue: ""
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
