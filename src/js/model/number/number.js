var AMPParse = AMPParse || {};

/**
 *
 * @param hexadecimal  - hexadecimal string to be parsed
 * @param precision - Integer for 32 bit or Vast for 64 bit
 * @param unsigned - true for unsigned value, false for unsigened
 * @returns {{returnValue: {type: string, value: string, precision: *, isSigned: boolean, binaryValue: string,, hexValue: string}, nibblesConsumed: *}}
 */
AMPParse.buildBasicNumber = function (hexadecimal, precision, unsigned)
{
    var Long = dcodeIO.Long;

    // Defensive programming
	if ( !(hexadecimal instanceof AMPHexConsumer) )
	{
		throw new ReferenceError("Did not receive a hex consumer");
	}

    if (typeof unsigned === "undefined" || typeof unsigned !== "boolean")
    {
        throw new ReferenceError("Provided sign parameter does not exist or is not a boolean");
    }

    var lowChars, highChars = "";
    var nibbles, lowValue, highValue = 0;

    if (precision === "Integer") {
        nibbles = 8; // 32 bits
    } else if (precision === "Vast") {
        nibbles = 16; // 64 bits
    } else {
        throw new ReferenceError("Provided precision is invalid: " + precision);
    }

    if (hexadecimal.remainingNibbles < nibbles)
    {
        throw new RangeError("The provided hex is too short to contain a " + precision + ".");
    }

    var decimalValue = ""
    var binaryValue = "";
    var hexValue = "";

    // Get the next 8 bytes and convert them to a decimal
    var highChars = hexadecimal.consumeNibbles(8);
    var highValue = hexadecimal.consumedHexInt;

    if (nibbles === 8) {
        binaryValue = "0b" + highValue.toString(2);
        hexValue = "0x" + highValue.toString(16).toUpperCase();
        if (unsigned === false) {
            // convert this to an signed integer
            highValue = highValue >> 0;
        }
        decimalValue = highValue.toString();
    } else {
        var lowChars = hexadecimal.consumeNibbles(8);
        lowValue = hexadecimal.consumedHexInt;

        // get unsigned version to get proper bit and hex strings
        var rawLong = new Long(lowValue, highValue, true);
        binaryValue  = "0b" + rawLong.toString(2);
        hexValue = "0x" + rawLong.toString(16).toUpperCase();

        // if we need the signed version calculate it
        if (!unsigned) {
            rawLong = rawLong.toSigned();
        }

        decimalValue = rawLong.toString();
    }

    var returnValue = {
        type: "Basic Number",
        value: decimalValue,
        precision: precision,
        isSigned: !unsigned,
        binaryValue: binaryValue,
        hexValue: hexValue
    };

    // Return object according to spec
    return {
        returnValue: returnValue,
        nibblesConsumed: nibbles
    };
}
