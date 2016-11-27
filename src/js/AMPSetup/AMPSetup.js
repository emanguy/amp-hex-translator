// Define AMPParse if it is not already
var AMPParse = AMPParse || {};

// Add nibblesConsumed property to every error
Error.prototype.nibblesConsumed = 0;

/**
 * Construct an AMPHexConsumer.
 *
 * @constructor
 * @param hexadecimal {string} The hexadecimal to consume
 */
function AMPHexConsumer(hexadecimal)
{
	if (typeof hexadecimal !== "string")
	{
		throw new ReferenceError("Provided hexadecimal is not a string.");
	}
	if (hexadecimal.length < 2 || hexadecimal.length % 2 !== 0)
	{
		throw new RangeError("Provided hexadecimal is either too short to contain a byte or is misaligned.");
	}

	this.hexadecimal = hexadecimal; // The "trailing hex"
	this.consumedHex = "";			// The latest consumed hex
}

// Defines a few obviously named computed properties.
// Usage: var integerValue = AMPHexConsumerInstance.consumedHexInt
// Usage: var howManyMoreNibbles = AMPHexConsumerInstance.remainingNibbles
// Usage: var noMoreNibbles = AMPHexConusumerInstance.isEmpty
Object.defineProperties(AMPHexConsumer.prototype, {
	"consumedHexInt": {
		get: function() {
			return parseInt(this.consumedHex, 16);
		},
		enumerable: true // just in case
	},
	"remainingNibbles": {
		get: function() {
			return this.hexadecimal.length;
		},
		enumerable: true
	},
	"isEmpty": {
		get: function() {
			return this.hexadecimal.length == 0;
		},
		enumerable: true
	}
});

/**
 * Consume some number of nibbles.
 *
 * @param nibbles {number=} Optional parameter which says how many nibbles to consume. Defaults to two.
 * @return {string} The new value of the consumedHex property of this object.
 */
AMPHexConsumer.prototype.consumeNibbles = function(nibbles)
{
	if (typeof nibbles === "undefined")
	{
		nibbles = 2;
	}
	if (isNaN(nibbles))
	{
		throw new ReferenceError("Nibbles is not a number.");
	}
	if (nibbles % 2 !== 0)
	{
		throw new Error("Consuming " + nibbles + " nibbles would cause the number to become misaligned.");
	}
	if (this.remainingNibbles < nibbles)
	{
		throw new RangeError("Cannot consume more than " + this.remainingNibbles + " nibbles!");
	}

	this.consumedHex = this.hexadecimal.substring(0, nibbles);
	this.hexadecimal = this.hexadecimal.substring(nibbles);

	return this.consumedHex;
}

/**
 * Associative array which maps data type enumerations to their real names
 */
AMPParse.typeTable = {
	9: "Byte",
	10: "Integer",
	11: "Unsigned Integer",
	12: "Vast",
	13: "Unsigned Vast",
	14: "Real (32)",
	15: "Real (64)",
	16: "SDNV",
	17: "Timestamp",
	18: "String",
	19: "Blob",
	20: "Managed Identifier",
	21: "MID Collection",
	22: "Expression",
	23: "Data Collection",
	24: "Typed Data Collection",
	25: "Table"
}
/*
 * This method allows functions to use model constructors even if they were not included in the
 * correct order in <script> tags.
 *
 * @param hexadecimal {AMPHexConsumer} The AMP hex consumer used for constructing the next value from the hexadecimal
 * @param typeEnumberation {number} The enumeration which represents the data type as defined in the AMP spec.
 *
 * @return The constructed model based on the specified data type enumeration. Will have returnValue and nibblesConsumed properties.
 */

AMPParse.buildUndeclaredType = function(hexadecimal, typeEnumeration)
{
	if ( !(hexadecimal instanceof AMPHexConsumer) )
	{
		throw new TypeError("Did not receive an instance of AMPHexConsumer");
	}
	if (isNaN(typeEnumeration))
	{
		throw new TypeError("typeEnumeration is not a number");
	}

	var parameters;
	var fnCall;
	var element;

	try
	{
		parameters = AMPBuilders[typeEnumeration].slice(); // Creates a copy of the array
	}
	catch (err)
	{
		err.message = "Unknown type: " + typeEnumeration;
		throw err;
	}

	// Move the method name into fnCall and replace it with hexadecimal consumer
	fnCall = parameters.splice(0, 1, hexadecimal)[0];
	element = AMPParse[fnCall].apply(AMPParse[fnCall], parameters);
	
	return element;
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
