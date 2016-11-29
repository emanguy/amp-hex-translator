var AMPParse = AMPParse || {};

AMPParse.validateHas0x = function(hexString)
{
    return /^0[xX]/.test(hexString);
}