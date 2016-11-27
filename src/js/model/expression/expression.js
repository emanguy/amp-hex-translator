AMPParse = AMPParse || {};

AMPParse.buildExpression = function(hexadecimal)
{
	// Defensive programming
	if ( !(hexadecimal instanceof AMPHexConsumer) )
	{
		throw new TypeError("Did not receive an AMPHexConsumer");
	}
	
	var consumedNibbles = 0;
	var returnValue = {};
	var tempStorage;

	returnValue.type = "Expression";

	// Get type
	tempStorage = AMPParse.buildByte(hexadecimal);
	consumedNibbles += tempStorage.nibblesConsumed;

	try
	{
		returnValue.returnType = AMPParse.typeTable[tempStorage.returnValue.value];
	}
	catch(err)
	{
		err.message = "Unknown type: " + tempStorage.returnValue.value;
		throw err;
	}

	// Get expression operation
	try
	{
		tempStorage = AMPParse.buildMIDCollection(hexadecimal);
		consumedNibbles += tempStorage.nibblesConsumed;
		returnValue.value = tempStorage.returnValue;
	}
	catch (err)
	{
		err.nibblesConsumed += consumedNibbles;
		throw err;
	}

	return {
		returnValue: returnValue,
		nibblesConsumed: consumedNibbles
	};
}
