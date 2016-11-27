var AMPParse = AMPParse || {};

AMPParse.buildMessage = function (hexadecimal) {

    if (!(hexadecimal instanceof AMPHexConsumer)) {
        throw new TypeError("Did not receive an instance of AMPHexConsumer");
    }

    hexadecimal.consumeNibbles();
    var rawInt = hexadecimal.consumedHexInt;
    var nibblesConsumed = 2;

    var opCodes = {
        0: {name: "Register Agent", function: AMPParse.buildRegisterAgent()},
        18: {name: "Data Report", function: AMPParse.buildDataReport()},
        26: {name: "Perform Control", function: AMPParse.buildPerformControl()},
    }

    var opCodeValue = rawInt & 31;

    var header = {
        hasTrailer: (rawInt & 128) === 1,
        negativeAcknowledgement: (rawInt & 64) === 1,
        acknowledgement: (rawInt & 32) === 1,
        opcodeValue: opCodeValue,
        opcodeName: opCodes[opCodeValue].name
    }

    var returnValue = {
        "type": "AMP Message",
        header: header,
        value: opCodes[opCodeValue].function
    }

    return {
        returnValue: returnValue,
        nibblesConsumed: nibblesConsumed
    }

};

AMPParse.buildRegisterAgent = function(hexadecimal) {
    return {
        type: "Register Agent Type"
    }
};

AMPParse.buildDataReport = function(hexadecimal) {
    return {
        type: "Data Report Type"
    }
};

AMPParse.buildPerformControl = function(hexadecimal) {
    return {
        type: "Perform Control Type"
    }
};

/*
 {
 "type": "AMP Message",
 "header": {
 "hasTrailer": true // This is the "ACL used" field
 "negativeAcknowledgement": true,
 "acknowledgement": true,
 "opcodeValue": 0,
 "opcodeName": "Register Agent"
 },
 "value":
 // For register agent
 {
 "agentId": { "type": "Blob", ... }
 }

 // For Data Report
 {
 "time": { "type": "Timestamp", ... },
 "receiverName": { "type": "Blob" },
 "entries": [
 { "type": "Report Entry", ... },
 { "type": "Report Entry", ... }
 ]
 }

 // For Perform Control
 {
 "startTime": { "type": "Timestamp", ... },
 "controls": { "type": "MID Collection", ...}
 }
 }
 */