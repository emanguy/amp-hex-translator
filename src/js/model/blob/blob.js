var AMPParse = AMPParse || {};

AMPParse.buildBlob = function(hexadecimal)
{
	// Defensive programming
	if (typeof hexadecimal !== "string")
	{
		throw new RangeError("Provided hexadecimal is not a string");
	}
	if (hexadecimal.length < 2 || hexadecimal.length % 2 != 0)
	{
		throw new RangeError("Provided hexadecimal is either too short to contain a byte or is misaligned");
	}

	// Read the length of the blob
	var blobLength;
	var returnValue = {
		type: "Blob",
		value: []
	};

	try
	{
		blobLength = AMPParse.buildSdnv(hexadecimal);
	}
	catch (err)
	{
		err.detail.nibblesConsumed = 0; // buildSdnv only throws errors when the hex is bad
		throw err;
	}

	var nibblesConsumed = blobLength.nibblesConsumed;
	var hexCopy = hexadecimal.trailingHex;
	blobLength = blobLength.returnValue.value;

	// Repeatedly read in bytes
	var nextByte;

	for (var i = 0; i < blobLength; i++)
	{
		try
		{
			nextByte = AMPParse.buildByte(hexCopy);
			hexCopy = nextByte.trailingHex;
			nibblesConsumed += nextByte.nibblesConsumed;

			returnValue.value.push(nextByte);
		}
		catch(err)
		{
			err.detail.nibblesConsumed = nibblesConsumed;
			throw err;
		}
	}

	return {
		returnValue: returnValue,
		nibblesConsumed: nibblesConsumed,
		trailingHex: hexCopy
	};
}