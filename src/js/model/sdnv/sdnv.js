var AMPParse = AMPParse || {};

AMPParse.buildSdnv = function(hexadecimal)
{
	// Defensive programming
	if ( !(hexadecimal instanceof AMPHexConsumer) )
	{
		throw new ReferenceError("Did not receive an AMPHexConsumer");
	}

	var result = 0;
	var nextByte;
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
		hexadecimal.consumeNibbles();
		nextByte = hexadecimal.consumedHexInt;
		hexRepresentation += hexadecimal.consumedHex;
		consumedNibbles += 2;

		// Shift the result left 7 bits and add the 7 least significant bits of the next byte
		result = ( result << 7 ) + (nextByte & 0x7F);
	} while (( nextByte & 0x80 ) > 0); // End the loop when the most significant bit is missing

	// Return the outputs
	return {
		returnValue: { type: "Sdnv", value: result, hexValue: "0x" + hexRepresentation },
		nibblesConsumed: consumedNibbles
	};
}
