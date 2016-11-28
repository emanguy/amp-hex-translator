var AMPParse = AMPParse || {};

AMPParse.buildReportEntry = function(hexadecimal)
{
    // Defensive programming
    if ( !(hexadecimal instanceof AMPHexConsumer) )
    {
        throw new TypeError("Did not receive an instance of AMPHexConsumer");
    }

    var returnValue = {
        type: "Report Entry",
        identifier: {},
        value: {}
    };

    var consumedNibbles = 0;
    var tempValue;

    // Get the identifier
    tempValue = AMPParse.buildManagedIdentifier(hexadecimal);
    returnValue.identifier = tempValue.returnValue;
    consumedNibbles += tempValue.nibblesConsumed;

    // Build the report entries
    try
    {
        tempValue = AMPParse.buildDataCollection(hexadecimal, true);
        consumedNibbles += tempValue.nibblesConsumed;
        returnValue.value = tempValue.returnValue;
    }
    catch (err)
    {
        err.nibblesConsumed += consumedNibbles;
        throw err;
    }

    return {
        returnValue: returnValue,
        nibblesConsumed: consumedNibbles
    };
}