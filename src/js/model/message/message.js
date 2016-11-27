var AMPParse = AMPParse || {};

AMPParse.buildMessage = function (hexadecimal) {

    if (!(hexadecimal instanceof AMPHexConsumer)) {
        throw new TypeError("Did not receive an instance of AMPHexConsumer");
    }

    hexadecimal.consumeNibbles();
    var rawInt = hexadecimal.consumedHexInt;
    var nibblesConsumed = 2;

    var opCodes = {
        0: {name: "Register Agent", function: AMPParse.buildRegisterAgent},
        18: {name: "Data Report", function: AMPParse.buildDataReport},
        26: {name: "Perform Control", function: AMPParse.buildPerformControl}
    };

    var opCodeValue = rawInt & 31;

    var header = {
        hasTrailer: (rawInt & 128) === 1,
        negativeAcknowledgement: (rawInt & 64) === 1,
        acknowledgement: (rawInt & 32) === 1,
        opcodeValue: opCodeValue,
        opcodeName: opCodes[opCodeValue].name
    };

    var value = {};
    try {
        value = opCodes[opCodeValue].function.apply(this, [hexadecimal]);
        nibblesConsumed += value.nibblesConsumed;
        value = value.returnValue;
    } catch (err) {
        err.nibblesConsumed += nibblesConsumed;
        err.message = "Failed to get message body: " + err.message;
        throw err;
    }

    var returnValue = {
        "type": "AMP Message",
        header: header,
        value: value
    };

    return {
        returnValue: returnValue,
        nibblesConsumed: nibblesConsumed
    }

};

AMPParse.buildRegisterAgent = function(hexadecimal) {
    var registerAgentBlob;

    registerAgentBlob = AMPParse.buildBlob(hexadecimal);
    this.nibblesConsumed = registerAgentBlob.nibblesConsumed;
    registerAgentBlob = registerAgentBlob.returnValue;

    return  registerAgentBlob;

};

AMPParse.buildDataReport = function(hexadecimal) {
    var timestamp = AMPParse.buildTimestamp(hexadecimal);
    this.nibblesConsumed += timestamp.nibblesConsumed;
    timestamp = timestamp.returnValue;

    var receiverName = AMPParse.buildBlob(hexadecimal);
    this.nibblesConsumed += receiverName.nibblesConsumed;
    receiverName = receiverName.returnValue;

    var entryCount = AMPParse.buildSdnv(hexadecimal);
    this.nibblesConsumed += entryCount.nibblesConsumed;
    entryCount = entryCount.returnValue;

    var entries = [];
    for (var i = 0; i < entryCount; i++) {
        try {
            var entry = AMPParse.buildReportEntry(hexadecimal);
            this.nibblesConsumed += entry.nibblesConsumed;
            entry = entry.returnValue;
            entries.push(entry);
        } catch (err) {
            if (err instanceof RangeError) {
                err.message = "Expected " + entryCount + " entry reports but only had enough bytes for " + i;
            }
            err.nibblesConsumed += this.nibblesConsumed;
            throw err;
        }
    }

    var returnValue = {
        time: timestamp,
        receiverName: receiverName,
        entries: entries
    };

    return  returnValue;
};

AMPParse.buildPerformControl = function(hexadecimal) {
    return {ran: "buildPerformControl"}; // TODO: remove this when buildTimestamp is merged
    var startTime = AMPParse.buildTimestamp(hexadecimal);
    this.nibblesConsumed += startTime.nibblesConsumed;
    startTime = startTime.returnValue;

    var controls = AMPParse.buildMIDCollection(hexadecimal);
    this.nibblesConsumed += controls.nibblesConsumed;
    controls = controls.returnValue;

    var returnValue = {
        startTime: startTime,
        controls: controls
    };

    return  returnValue;

};