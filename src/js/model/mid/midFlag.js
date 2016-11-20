var AMPParse = AMPParse || {};

AMPParse.buildMidFlag = function(hexadecimal) {

    if (!(hexadecimal instanceof AMPHexConsumer)) {
        throw new ReferenceError("Did not receive an AMPHexConsumer");
    }

    hexadecimal.consumeNibbles();
    var byteValue = hexadecimal.consumedHexInt;

    var OID = (byteValue & 192) >> 6;
    var hasTag = ((byteValue & 32) >> 5) === 1;
    var hasIssuer = ((byteValue & 16) >> 4) === 1;

    // TODO: verify this is right, sturctures go up to 25 so why only 4 bits?
    var structureId = byteValue & 15;

    var isCompressed, isParametrized = false;

    switch(OID) {
        case 0:
            isParametrized = false;
            isCompressed = false;
            break;
        case 1:
            isParametrized = true;
            isCompressed = false;
            break;
        case 2:
            isParametrized = false;
            isCompressed = true;
            break;
        case 3:
            isParametrized = true;
            isCompressed = true;
            break;
        default:
            throw new ReferenceError("Invalid OID was present in the MID Flag");
    }

    var returnValue = {
        isCompressed: isCompressed,
        isParametrized: isParametrized,
        hasTag: hasTag,
        hasIssuer: hasIssuer,
        enclosedStructId: AMPParse.getStructTypeFromId(structureId).name
    }

    return {
        returnValue: returnValue,
        nibblesConsumed: 2
    }

}