var AMPParse = AMPParse || {};

AMPParse.buildBlob = function(hexadecimal)
{
	// Defensive programming
	if ( !(hexadecimal instanceof AMPHexConsumer) )
	{
		throw new ReferenceError("Did not receive an instance of AMPHexConsumer");
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
		err.nibblesConsumed = 0; // buildSdnv only throws errors when the hex is bad
		throw err;
	}

	var nibblesConsumed = blobLength.nibblesConsumed;
	blobLength = blobLength.returnValue.value;

	// Repeatedly read in bytes
	for (var i = 0; i < blobLength; i++)
	{
		try
		{
			if (hexadecimal.isEmpty)
			{
				throw new RangeError("There were fewer bytes than stated by the length SDNV.");
			}

			nextByte = AMPParse.buildByte(hexadecimal);
			nibblesConsumed += nextByte.nibblesConsumed;

			returnValue.value.push(nextByte.returnValue);
		}
		catch(err)
		{
			err.nibblesConsumed += nibblesConsumed;
			throw err;
		}
	}

	return {
		returnValue: returnValue,
		nibblesConsumed: nibblesConsumed
	};
}
