var AMPParse = AMPParse || {};

AMPParse.validateIsHex = function(hexStr)
{
    return !( /[^0-9a-fA-F]/.test(hexStr.substring(2)) );
}