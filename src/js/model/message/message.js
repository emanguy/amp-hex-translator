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

    if (!opCodes[opCodeValue]) {
        throw new TypeError("Opcode must be 0, 18 or 26. Invalid value was " + opCodeValue);
    }

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
    } catch (err) {
        err.message = "Failed to get message body: " + err.message;
        err.nibblesConsumed += nibblesConsumed;
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
    return {
        agentId: registerAgentBlob.returnValue
    };
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

    return {
        time: timestamp,
        receiverName: receiverName,
        entries: entries
    };
};

AMPParse.buildPerformControl = function(hexadecimal) {
    var startTime = AMPParse.buildSdnv(hexadecimal);  // TODO: change this when buildTimestamp is merged
    this.nibblesConsumed += startTime.nibblesConsumed;
    startTime = startTime.returnValue;

    var controls = AMPParse.buildMIDCollection(hexadecimal);
    this.nibblesConsumed += controls.nibblesConsumed;
    controls = controls.returnValue;

    return {
        startTime: startTime,
        controls: controls
    };
};