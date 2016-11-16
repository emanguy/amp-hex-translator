var AMPParse = AMPParse || {};

AMPParse.buildOid = function(hexadecimal, isCompressed)
{
	// Defensive programming
	if (typeof hexadecimal !== "string" )
	{
		throw new ReferenceError("Provided hexadecimal is not a string.");
	}
	if (typeof isCompressed !== "boolean")
	{
		throw new ReferenceError("Provided isCompressed flag is not a boolean.");
	}
	if (hexadecimal.length < 2 || hexadecimal.length % 2 !== 0)
	{
		throw new ReferenceError("Provided hexadecimal is either too short or is misaligned.");
	}

	var consumedNibbles = 0;

	if (isCompressed)
	{
		
	}
}
