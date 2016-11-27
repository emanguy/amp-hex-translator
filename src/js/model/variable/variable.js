var AMPParse = AMPParse || {};

AMPParse.buildVariable = function(hexadecimal)
{
	// Defensive Programming
	if ( !(hexadecimal instanceof AMPHexConsumer) )
	{
		throw new TypeError("Did not receive an instance of AMPHexConsumer");
	}

	var returnValue = {
		type: "Variable",
		id: {},
		variableType: "",
		value: {}
	};

	var consumedNibbles = 0;
	var tempValue;

	// Determine the unique identifier for this variable
	tempValue = AMPParse.buildManagedIdentifier(hexadecimal);
	returnValue.id = tempValue.returnValue;
	consumedNibbles += tempValue.nibblesConsumed;

	// Determine the variable's type
	try
	{
		tempValue = AMPParse.buildByte(hexadecimal);
		consumedNibbles += tempValue.nibblesConsumed;
		tempValue = tempValue.returnValue;
	}
	catch (err)
	{
		err.nibblesConsumed += consumedNibbles;
		throw err;
	}

	try
	{
		returnValue.variableType = AMPParse.typeTable[tempValue.value];
	}
	catch (err)
	{
		err.nibblesConsumed += consumedNibbles;
		err.message = "Unknown type enumeration: " + tempValue.value;
		throw err;
	}

	// Build the expression necessary for initializing the variable
	try
	{
		tempValue = AMPParse.buildExpression(hexadecimal);
		consumedNibbles += tempValue.nibblesConsumed;
		returnValue.value = tempValue.returnValue;
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
