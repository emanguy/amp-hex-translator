var AMPParse = AMPParse || {};

/**
 * Builds an OID object as per the spec.
 *
 * @param hexadecimal {AMPHexConsumer} The hex consumer to draw bytes from
 * @param isCompressed {boolean} Whether or not this is a compressed OID.
 * @return {Object} The object representation of the OID
 */
AMPParse.buildOid = function(hexadecimal, isCompressed)
{
	// Defensive programming
	if ( !(hexadecimal instanceof AMPHexConsumer) )
	{
		throw new ReferenceError("Did not receive an AMPHexConsumer");
	}
	if (typeof isCompressed !== "boolean")
	{
		throw new ReferenceError("Provided isCompressed flag is not a boolean.");
	}

	var consumedNibbles = 0;
	var returnValue = { type: "Object Identifier" };
	var nickname;
	var heirarchy;

	// Read the nickname for a compressed OID
	if (isCompressed)
	{
		try
		{
			nickname = AMPParse.buildSdnv(hexadecimal);
		}
		catch (err)
		{
			throw err;
		}

		returnValue.nickname = "[" + nickname.returnValue.value + "]";
		consumedNibbles = nickname.nibblesConsumed;
		nickname = nickname.returnValue.value;
	}

	// Read the blob and map the values into their own array
	try
	{
		heirarchy = AMPParse.buildBlob(hexadecimal);
	}
	catch (err)
	{
		err.nibblesConsumed += consumedNibbles;
		throw err;
	}

	consumedNibbles += heirarchy.nibblesConsumed;
	heirarchy = heirarchy.returnValue.value.map(function(byteOutput) {
		return byteOutput.value;
	});

	// Turn the first byte into the first two indices if the OID is uncompressed, otherwise prepend nickname
	if (!isCompressed)
	{
		var firstNumber = heirarchy.shift();
		var secondNumber = firstNumber % 40;
		firstNumber = (firstNumber - secondNumber) / 40;

		heirarchy.unshift(firstNumber, secondNumber);
	}

	// Shallow copy the heirarchy array and prepend the default OID header if it's compressed
	var lookupHeirarchy = heirarchy.slice();

	if (isCompressed)
	{
		lookupHeirarchy.unshift(nickname); // Add the nickname!
		lookupHeirarchy = _defaultOidRoot.concat(lookupHeirarchy);
	}

	try
	{
		var extraInfo = _oidList;

		while (lookupHeirarchy.length > 0)
		{
			extraInfo = extraInfo[lookupHeirarchy.shift()];
		}

		returnValue.extraInfo = extraInfo;
	}
	catch (err)
	{
		returnValue.extraInfo = "Unknown OID";
	}
	
	// Turn the array into a "1.3.6.1.2 ... etc." string
	var initialValue = "" + heirarchy.shift();
	returnValue.value = heirarchy.reduce(function(accumulator, value) {
		return accumulator + "." + value;
	}, initialValue);

	return {
		returnValue: returnValue,
		nibblesConsumed: consumedNibbles
	};
}

/**
 * Add an oid to the oid tree.
 *
 * @param oidArr {array} Contains the full uncompressed OID tree path where the "extra info" string for the OID will be stored
 * @param label {string} What the "extra info" property is when this OID is looked up
 */
AMPParse.addOid = function(oidArr, label)
{
	// Defensive programming
	oidArr.forEach(function(item, index) {
		if (isNaN(item))
		{
			throw new ReferenceError("Item at index " + index + "in OID array is not a number.");
		}
	});

	if (typeof label === "undefined")
	{
		throw new ReferenceError("Did not pass a label for the specified OID");
	}
	
	// Drill down to tree location, creating objects along the way if need be
	var index;
	var currentObj = _oidList;

	while (oidArr.length > 1)
	{
		index = oidArr.shift();

		// If the index doesn't exist (i.e. is falsey) create it
		if (!currentObj[index])
		{
			currentObj[index] = {};
		}

		currentObj = currentObj[index];
	}

	// Pop the final index off and apply the label as the value
	index = oidArr.shift();
	currentObj[index] = label;
};

/**
 * Sets the default OID root prepended to compressed OIDs
 *
 * @param rootArr {array} The oid root expressed as individual values in an array.
 */
AMPParse.setDefaultOidRoot = function(rootArr)
{
	// Defensive programming
	rootArr.forEach(function(item, index) {
		if (isNaN(item))
		{
			throw new ReferenceError("Item at index " + index + "in OID array is not a number.");
		}
	});

	_defaultOidRoot = rootArr;
};

var _defaultOidRoot = [1, 3, 6, 1, 2, 3, 3];

var _oidList = {
	1: {
		3: {
			6: {
				1: {
					2: {
						3: {
							3: {
								0: {
									0: "ADM Name",
									1: "ADM Version"
								},
								1: {
									0: "Num Reports",
									1: "Sent Reports",
									2: "Num Time Based Rules",
									3: "Run Time Based Rules",
									4: "Num State Based Rules",
									5: "Run State Based Rules",
									6: "Num Literals",
									7: "Num Variables",
									8: "Num Macros",
									9: "Run Macros",
									10: "Num Controls",
									11: "Run Controls",
									12: "Current Time"
								},
								2: {
									0: "Num Rules"
								},
								3: {
									0: "Full Report"
								},
								4: {
									0: "List ADMs",
									1: "Add Variable",
									2: "Delete Variable",
									3: "List Variables",
									4: "Describe Variables",
									5: "Add Report Template",
									6: "Delete Report Template",
									7: "List Report Templates",
									8: "Describe Report Templates",
									9: "Generate Reports",
									10: "Add Macro",
									11: "Delete Macro",
									12: "List Macros",
									13: "Describe Macros",
									14: "Add Time Based Rule",
									15: "Delete Time Based Rule",
									16: "List Time Based Rules",
									17: "Describe Time Based Rules",
									18: "Add State Based Rule",
									19: "Delete State Based Rule",
									20: "List State Based Rules",
									21: "Describe State Based Rules",
									22: "Store Variable",
									23: "Reset Counts"
								},
								5: {
									0: "AMP Epoch",
									1: "User VAST",
									2: "User UVAST",
									3: "User Float",
									4: "User Double",
									5: "User String",
									6: "User BLOB"
								},
								6: {
									0: "User List"
								},
								7: {
									0: "+",
									1: "-",
									2: "*",
									3: "/",
									4: "%",
									5: "^",
									6: "&",
									7: "|",
									8: "#",
									9: "~",
									10: "&&",
									11: "||",
									12: "!",
									13: "abs",
									14: "<",
									15: ">",
									16: "<=",
									17: ">=",
									18: "!=",
									19: "==",
									20: "<<",
									21: ">>",
									22: "STOR"
								}
							}
						}
					}
				}
			}
		}
	}
};
