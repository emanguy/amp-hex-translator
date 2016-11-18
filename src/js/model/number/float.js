var AMPParse = AMPParse || {};


AMPParse.buildFloatNumber = function (hexadecimal, precision)
{
    // Defensive programming
    if (typeof hexadecimal === "undefined" || typeof hexadecimal !== "string")
    {
        throw new ReferenceError("Provided hexadecimal parameter does not exist or is not a string");
    }

    var nibbles = 0;

    if (precision === "32") {
        nibbles = 8; // 32 bits
    } else if (precision === "64") {
        nibbles = 16; // 64 bits
    } else {
        throw new ReferenceError("Provided precision is invalid: " + precision);
    }

    if (hexadecimal.length < nibbles)
    {
        throw new RangeError("The provided hex is too short to contain a " + precision +" bit float.");
    }

    var binary = "";
    for (var i = 0; i < nibbles; i=i+2)
    {
        var nextChars = hexadecimal.substr(i, 2);
        var rawValue = parseInt(nextChars, 16);
        binary += pad(rawValue.toString(2));
    }

    // sign bit is always first regardless of size
    var sign =  binary.charAt(0);

    var exponent;
    var mantissa;
    if (nibbles === 8) {
        exponent = binary.substr(1, 8);
        mantissa = binary.substr(9);
    } else {
        exponent = binary.substr(1, 11);
        mantissa = binary.substr(12);
    }

    // convert the sign and exponent back to a number to use in the calculation
    sign = parseInt(sign, 2);
    exponent = parseInt(exponent, 2);
    if (nibbles === 8) {
        exponent -= 127;
    } else {
        exponent -= 1023;
    }
    var fraction = mantissaToFraction(mantissa);

    var value = Math.pow(-1, sign)  * Math.pow(2, exponent) * fraction;

    // the math from above is done at double precision in JS so cut the
    // number off at 6 decimal places for the 32 bit value
    if (nibbles === 8) {
        // the plus drops any 0's padded to the end, for example 1.500000 becomes 1.5
        value = +value.toFixed(6);
    }

    var returnValue = {
        type: "Real",
        value: value.toString(),
        precision: precision,
        sign: sign,
        fraction: fraction,
        exponent: exponent
    }

    // Return object according to spec
    return {
        returnValue: returnValue,
        nibblesConsumed: nibbles,
        trailingHex: hexadecimal.substr(nibbles)
    };
}

// helper function that adds leading 0's to binary
var pad = function(s) {
    while (s.length < 8) s = "0" + s;
    return s;
};

// takes in binary string and converts it to a fraction
var mantissaToFraction = function(mantissa) {
    var frac = 1;
    for (var i=0; i < mantissa.length; i++) {
        if (mantissa.charAt(i) == 1) {
            frac += 1 / Math.pow(2,i+1);
        }
    }
    return frac;
}