var AMPParse = AMPParse || {};

AMPParse.validateIsHex = function(hexStr)
{
    if ( typeof hexStr !== "string")
    {
        throw new TypeError("Provided input is not a string.");
    }

    // Trim the 0x if it exists
    var testString = (/^0[xX]/.test(hexStr.substring(0, 2)) ? hexStr.substring(2) : hexStr );
    // Return true if there are no characters outside the range 0-9, a-f, or A-F
    return !( /[^0-9a-fA-F]/.test(testString) );
}