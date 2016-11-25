var AMPParse = AMPParse || {};

AMPParse.buildTable = function (hexadecimal) {
    if ( !(hexadecimal instanceof AMPHexConsumer) )
    {
        throw new TypeError("Did not receive a hex consumer");
    }

    var nibblesConsumed = 0;
    var columnNames = [];

    try {
        columnNames = AMPParse.buildDataCollection();
        nibblesConsumed += columnNames.returnValue.nibblesConsumed;
    } catch (err) {
        err.nibblesConsumed = 0;
        err.message = "Could not extract column names for table: " + err.message;
        throw err;
    }


    // Convert the column names from blobs to an array of AMP strings
    columnNames = columnNames.returnValue.value.map(function(blob){
        var blobHex = blob.returnValue.value.map(function(byte){
            // convert the byte int value back to hex
            return byte.returnValue.value.toString(16);
        });

        //join the hex array into a single string
        blobHex = blobHex.join("");

        // create consumer so we can pass it to buildString
        try {
            var consume = new AMPHexConsumer(blobHex);
            return AMPParse.buildString(consume);
        } catch (err) {
            err.nibblesConsumed = nibblesConsumed;
            err.message = "Could not convert " +blobHex + " to a column name string";
            throw err;
        }
    });

    var colTypes;
    try {
        colTypes = AMPParse.buildBlob(hexadecimal);
        nibblesConsumed += colTypes.returnValue.nibblesConsumed;
    } catch (err) {
        err.nibblesConsumed = nibblesConsumed;
        err.message = "Could not extract column types for table: " + err.message;
        throw err;
    }

    // make sure the number of column names match the type blob length
    if (columnNames.length != colTypes.returnValue.value.length) {
        var err = new RangeError("Expected  " + columnNames.length + " column types " +
            "but received " + colTypes.returnValue.value.length);
        err.nibblesConsumed = nibblesConsumed;
        throw err;
    }

    var numRows = 0;
    try {
        numRows = AMPParse.buildSdnv(hexadecimal);
        nibblesConsumed += numRows.returnValue.nibblesConsumed;
    } catch (err) {
        err.nibblesConsumed += nibblesConsumed;
        err.message = "Could not extract number of rows for table: " + err.message;
    }

    var rows = [];
    for (var i = 0; i < numRows; i++) {
        var row = colTypes.returnValue.value.map(function(typeByte) {
            try {
                var obj = AMPParse.buildByEnumeration(hexadecimal, typeByte.returnValue.value);
                nibblesConsumed += obj.returnValue.nibblesConsumed;
            } catch(err) {
                err.nibblesConsumed += nibblesConsumed;
                err.message = "Failed to get row object: " + err.message;
                throw err;
            }

        });
        rows.push(row);
    }


    var returnValue = {
        type: "Table",
        columnNames: columnNames,
        value: rows
    };

    return {
        returnValue: returnValue,
        nibblesConsumed: nibblesConsumed
    }
};