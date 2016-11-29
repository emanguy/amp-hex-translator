var AMPParse = AMPParse || {};

AMPParse.buildMessageGroup = function (hexadecimal) {

    if (!(hexadecimal instanceof AMPHexConsumer)) {
        throw new TypeError("Did not receive an AMPHexConsumer");
    }

    var nibblesConsumed = 0;
    var messageCount = 0;
    var timestamp;
    var values = [];


    try {
        messageCount = AMPParse.buildSdnv(hexadecimal);
        nibblesConsumed += messageCount.nibblesConsumed;
        messageCount = messageCount.returnValue.value;
    } catch (err) {
        err.message = "Failed to get message count for message group: " + err.message;
        throw err;
    }

    try {
        timestamp = AMPParse.buildTimestamp(hexadecimal);
        nibblesConsumed += timestamp.nibblesConsumed;
        timestamp = timestamp.returnValue;
    } catch(err) {
        err.message = "Failed to get timestamp for message group: " + err.message;
        err.nibblesConsumed += nibblesConsumed;
        throw err;
    }

    for (var i = 0; i < messageCount; i++) {
        try {
            var message = AMPParse.buildMessage(hexadecimal);
            nibblesConsumed += message.nibblesConsumed;
            values.push(message.returnValue);
        } catch(err) {
            // RangeError indicates there were not enough bytes to create the expected amount of messages
            if (err instanceof RangeError) {
                err.message = "Expected " + messageCount + " messages but there were only" +
                    " enough bytes for " + i;
            } else {
                err.messsage = "Failed to build message in message group: " + err.message;
            }
            err.nibblesConsumed += nibblesConsumed;
            throw err;
        }

    }

    var returnValue = {
        type: "Message Group",
        timestamp: timestamp,
        value: values
    }

    return {
        returnValue: returnValue,
        nibblesConsumed: nibblesConsumed
    }


};