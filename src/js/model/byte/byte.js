var AMPParse = AMPParse || {};

AMPParse.buildByte = function (hexadecimal)
{
	// Defensive programming
	if ( !(hexadecimal instanceof AMPHexConsumer) )
	{
		throw new ReferenceError("Did not receive an AMPHexConsumer");
	}

	// Snag the relevant bytes and build return value object
	hexadecimal.consumeNibbles();
	var byteChars = hexadecimal.consumedHex;
	var rawValue = hexadecimal.consumedHexInt;
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
		nibblesConsumed: 2
	};
}
