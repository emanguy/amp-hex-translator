var AMPParse = AMPParse || {};

AMPParse.buildStateBasedRule = function(hexadecimal)
{
    // Defensive programming
    if ( !(hexadecimal instanceof AMPHexConsumer) )
    {
        throw new TypeError("Did not receive an instance of AMPHexConsumer");
    }

    var returnValue = {
        type: "State Based Rule",
        identifier: {},
        startTime: {},
        condition: {},
        count: {},
        value: {}
    }

    var tempValue;
    var consumedNibbles = 0;

    // Get the identifier off the front
    tempValue = AMPParse.buildManagedIdentifier(hexadecimal);
    consumedNibbles += tempValue.nibblesConsumed;
    returnValue.identifier = tempValue.returnValue;

    // Get the timestamp next
    try
    {
        tempValue = AMPParse.buildTimestamp(hexadecimal);
        consumedNibbles += tempValue.nibblesConsumed;
        returnValue.startTime = tempValue.returnValue;
    }
    catch (err)
    {
        err.nibblesConsumed += consumedNibbles;
        throw err;
    }

    // Then the condition
    try
    {
        tempValue = AMPParse.buildExpression(hexadecimal);
        consumedNibbles += tempValue.nibblesConsumed;
        returnValue.condition = tempValue.returnValue;
    }
    catch (err)
    {
        err.nibblesConsumed += consumedNibbles;
        throw err;
    }

    // Now the number of times to execute the Rule
    try
    {
        tempValue = AMPParse.buildBasicNumber(hexadecimal, "Integer", false);
        consumedNibbles += tempValue.nibblesConsumed;
        returnValue.count = tempValue.returnValue;
    }
    catch (err)
    {
        err.nibblesConsumed += consumedNibbles;
        throw err;
    }

    // Finally the controls to execute in an MID collection
    try
    {
        tempValue = AMPParse.buildMidCollection(hexadecimal);
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