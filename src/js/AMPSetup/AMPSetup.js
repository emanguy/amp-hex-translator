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
 */
AMPHexConsumer.prototype.consumeNibbles = function(nibbles)
{
	if (!this.isEmpty)
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
	}

	return this.consumedHex;
}

