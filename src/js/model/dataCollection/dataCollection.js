var AMPParse = AMPParse || {};

AMPParse.buildDataCollection = function (hexadecimal, isTyped)
{
	// Defensive Programming
	if ( !(hexadecimal instanceof AMPHexConsumer) )
	{
		throw new TypeError("Did not receive an instance of AMPHexConsumer");
	}
	if (typeof isTyped !== "boolean")
	{
		throw new TypeError("isTyped is not a boolean value.");
	}

	var numBlobs;
	var nibblesConsumed;

	// Get the number of "blobs" contained
	try
	{
		numBlobs = AMPParse.buildSdnv(hexadecimal);
		nibblesConsumed = numBlobs.nibblesConsumed;
		numBlobs = numBlobs.returnValue.value;
	}
	catch (err)
	{
		throw err;
	}

	var types;

	// Build the array of types to read
	if (isTyped)
	{
		// For typed, we just read in the type attributes
		try
		{
			types = AMPParse.buildBlob(hexadecimal);
		}
		catch (err)
		{
			err.nibblesConsumed += nibblesConsumed;
			throw err;
		}

		// Test to see if we got types for all subsequent blobs
		if (types.nibblesConsumed / 2 - 1 !== numBlobs - 1)
		{
			var err = new RangeError("Did not have types for all subsequent blobs");
			err.nibblesConsumed += nibblesConsumed;
			throw err;
		}

		nibblesConsumed += types.nibblesConsumed;
		types = types.returnValue.value.map(function(arrItem) {
			return arrItem.value;
		});

		numBlobs--;
	}
	else
	{
		// For non typed we just make an array of byte readers
		types = new Array(numBlobs);

		for (var index = 0; index < numBlobs; index++)
		{
			types[index] = 19;
		}
	}

	// Build the array of contained values
	var elementArray = [];
	var element;
	var type;

	while (!hexadecimal.isEmpty && types.length > 0)
	{
		type = types.shift();
		
		try
		{
			if (isTyped)
			{
				// Here I use numBlobs to specify how many bytes I expect to read
				numBlobs = AMPParse.buildSdnv(hexadecimal);
				nibblesConsumed += numBlobs.nibblesConsumed;
				numBlobs = numBlobs.returnValue.value;
			}
			
			element = AMPParse.buildUndeclaredType(hexadecimal, type);
			
			// Check to see that the correct number of bytes was consumed
			if (isTyped && numBlobs !== element.nibblesConsumed / 2)
			{
				throw new RangeError("SDNV lied about blob length");
			}

			nibblesConsumed += element.nibblesConsumed;
			elementArray.push(element.returnValue);
		}
		catch (err)
		{
			err.nibblesConsumed += nibblesConsumed;
			throw err;
		}

	}

	if (hexadecimal.isEmpty && types.length > 0)
	{
		throw new RangeError("Data Collection specified more bytes than were available.");
	}

	return {
		returnValue: {
			type: "Data Collection",
			value: elementArray,
			isTyped: isTyped
		},
		nibblesConsumed: nibblesConsumed
	};
}
