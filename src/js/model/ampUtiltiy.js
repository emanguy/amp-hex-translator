AMPParse.buildByEnumeration = function(hexadecimal, type) {
    if (type < 0 || type > 25) {
        throw new RangeError("Invalid type: " + type);
    }

    var functionMap = {
        0:  [ "buildEDD" ],
        1:  [ "buildVariable" ],
        2:  [ "buildReport" ],
        3:  [ "buildControl" ],
        4:  [ "buildStateBasedRule" ],
        5:  [ "buildTimeBasedRule " ],
        6:  [ "buildMacro" ],
        7:  [ "buildLiteral" ],
        8:  [ "buildOperator" ],
        9:  [ "buildByte" ],
        10: [ "buildBasicNumber", "Integer", false ],
        11: [ "buildBasicNumber", "Integer", true ],
        12: [ "buildBasicNumber", "Vast", false ],
        13: [ "buildBasicNumber", "Vast", true ],
        14: [ "buildFloatNumber", "32" ],
        15: [ "buildFloatNumber", "64" ],
        16: [ "buildSdnv" ],
        17: [ "buildTimestamp" ],
        18: [ "buildString" ],
        19: [ "buildBlob" ],
        20: [ "buildManagedIdentifier" ],
        21: [ "buildMIDCollection" ],
        22: [ "buildExpression" ],
        23: [ "buildDataCollection", false ],
        24: [ "buildDataCollection", true ],
        25: [ "buildTable" ]
    };

    var parameters = functionMap[type].slice();
    var fnCall = parameters.splice(0, 1, hexadecimal)[0];
    var rtnObject = AMPParse[fnCall].apply(rtnObject, parameters);
    return rtnObject;

};