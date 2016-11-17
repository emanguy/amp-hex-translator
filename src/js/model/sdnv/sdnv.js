var AMPParse = AMPParse || {};

AMPParse.buildSdnv = function(hexadecimal)
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

	var result = 0;
	var nextByte;
	var nextHex = hexadecimal;
	var consumedNibbles = 0;
	var hexRepresentation = "";

	// Keep adding onto the result as long as there's a 1 in the most significant bit
	do
	{
		// Check to make sure the SDNV actually terminates
		if (nextHex.length < 2)
		{
			throw new RangeError("The SDNV never terminated.");
		}

		// Get the value of the next byte and add it onto the hex representation
		nextByte = parseInt( nextHex.substring(0,2), 16 );
		hexRepresentation += nextHex.substring(0,2);
		nextHex = nextHex.substring(2);
		consumedNibbles += 2;

		// Shift the result left 7 bits and add the 7 least significant bits of the next byte
		result = ( result << 7 ) + (nextByte & 0x7F);
	} while (( nextByte & 0x80 ) > 0); // End the loop when the most significant bit is missing

	// Return the outputs
	return {
		returnValue: { type: "Sdnv", value: result, hexValue: "0x" + hexRepresentation },
		trailingHex: nextHex,
		nibblesConsumed: consumedNibbles
	};
}
