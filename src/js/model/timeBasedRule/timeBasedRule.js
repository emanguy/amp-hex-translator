var AMPParse = AMPParse || {};

AMPParse.buildTimeBasedRule = function(hexadecimal)
{
    // Defensive Programming
    if ( !(hexadecimal instanceof AMPHexConsumer) )
    {
        throw new TypeError("Did not receive an instance of AMPHexConsumer");
    }

    var returnValue = {
        type: "Time Based Rule",
        identifier: {},
        startTime: {},
        period: {},
        count: {},
        value: {}
    };
    var consumedNibbles = 0;
    var tempStorage;

    // Get the identifier
    tempStorage = AMPParse.buildManagedIdentifier(hexadecimal);
    consumedNibbles += tempStorage.nibblesConsumed;
    returnValue.identifier = tempStorage.returnValue;

    // Get the start Time
    try
    {
        tempStorage = AMPParse.buildTimestamp(hexadecimal);
        consumedNibbles += tempStorage.nibblesConsumed;
        returnValue.startTime = tempStorage.returnValue;
    }
    catch (err)
    {
        err.nibblesConsumed += consumedNibbles;
        throw err;
    }

    // Get the period of execution
    try
    {
        tempStorage = AMPParse.buildBasicNumber(hexadecimal, "Integer", true);
        consumedNibbles += tempStorage.nibblesConsumed;
        returnValue.period = tempStorage.returnValue;
    }
    catch (err)
    {
        err.nibblesConsumed += consumedNibbles;
        throw err;
    }

    // Get the number of times to execute the Rule
    try
    {
        tempStorage = AMPParse.buildBasicNumber(hexadecimal, "Integer", true);
        consumedNibbles += tempStorage.nibblesConsumed;
        returnValue.count = tempStorage.returnValue;
    }
    catch (err)
    {
        err.nibblesConsumed += consumedNibbles;
        throw err;
    }

    // Get the MID collection representing the controls to execute
    try
    {
        tempStorage = AMPParse.buildMIDCollection(hexadecimal);
        consumedNibbles += tempStorage.nibblesConsumed;
        returnValue.value = tempStorage.returnValue;
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