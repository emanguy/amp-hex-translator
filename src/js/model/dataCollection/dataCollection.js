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

		for (var index in types)
		{
			types[index] = 9;
		}
	}

	// Build the array of contained values
	var elementArray = [];
	var element;
	var parameters;
	var fnCall;
	var type;

	while (!hexadecimal.isEmpty && types.length > 0)
	{
		try
		{
			type = types.shift();
			parameters = AMPBuilders[type].slice(); // Creates a copy of the array
		}
		catch (err)
		{
			err.nibblesConsumed += nibblesConsumed;
			err.message = "Unknown type: " + type;
			throw err;
		}

		// Move the method name into fnCall and replace it with hexadecimal consumer
		fnCall = parameters.splice(0, 1, hexadecimal)[0];
		
		try
		{
			// Here I use numBlobs to specify how many bytes I expect to read
			numBlobs = AMPParse.buildSdnv(hexadecimal);
			nibblesConsumed += numBlobs.nibblesConsumed;
			numBlobs = numBlobs.returnValue.value;

			element = AMPParse[fnCall].apply(AMPParse[fnCall], parameters);
			
			// Check to see that the correct number of bytes was consumed
			if (numBlobs !== element.nibblesConsumed / 2)
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

// This is used so that inclusion order doesn't matter other than buildSdnv and buildBlob
AMPBuilders = {
	9: [ "buildByte" ],
	10: [ "buildBasicNumber", "Integer", false ],
	11: [ "buildBasicNumber", "Integer", true ],
	12: [ "buildBasicNumber", "Vast", false ],
	13: [ "buildBasicNumber", "Vast", true ],
	14: [ "buildFloatNumber", "32" ],
	15: [ "buildFloatNumber", "64" ],
	16: [ "buildSdnv" ],
	17: [ "buildTimestamp" ],
	18: [ "buildString" ],
	19: [ "buildBlob" ],
	20: [ "buildManagedIdentifier" ],
	21: [ "buildMIDCollection" ],
	22: [ "buildExpression" ],
	23: [ "buildDataCollection", false ],
	24: [ "buildDataCollection", true ],
	25: [ "buildTable" ]
}
