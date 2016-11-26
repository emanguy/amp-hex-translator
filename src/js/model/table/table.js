var AMPParse = AMPParse || {};

AMPParse.buildTable = function (hexadecimal) {
    if ( !(hexadecimal instanceof AMPHexConsumer) )
    {
        throw new TypeError("Did not receive a hex consumer");
    }

    var nibblesConsumed = 0;
    var columnNames = [];

    try {
        columnNames = AMPParse.buildDataCollection(hexadecimal, false);
        nibblesConsumed += columnNames.nibblesConsumed;
    } catch (err) {
        err.nibblesConsumed = 0;
        err.message = "Could not extract column names for table: " + err.message;
        throw err;
    }


    // Convert the column names from blobs to an array of AMP strings
    var columnNames = columnNames.returnValue.value.map(function(blob){
        var blobHex = blob.value.map(function(byte){
            // convert the byte int value back to hex
            var asHex = byte.value.toString(16);
            // need leading 0's to stay aligned properly
            return asHex.length === 1 ? "0" + asHex : asHex;
        });

        //join the hex array into a single string
        blobHex = blobHex.join("");

        // create consumer so we can pass it to buildString
        try {
            var consume = new AMPHexConsumer(blobHex);
            var colName = AMPParse.buildString(consume);
            return colName.returnValue;
        } catch (err) {
            err.nibblesConsumed = nibblesConsumed;
            err.message = "Could not convert " +blobHex + " to a column name string";
            throw err;
        }
    });

    var colTypes;
    try {
        colTypes = AMPParse.buildBlob(hexadecimal);
        nibblesConsumed += colTypes.nibblesConsumed;
        colTypes = colTypes.returnValue;
    } catch (err) {
        err.nibblesConsumed = nibblesConsumed;
        err.message = "Could not extract column types for table: " + err.message;
        throw err;
    }

    // make sure the number of column names match the type blob length
    if (columnNames.length != colTypes.value.length) {
        var err = new RangeError("Expected  " + columnNames.length + " column types " +
            "but received " + colTypes.value.length);
        err.nibblesConsumed = nibblesConsumed;
        throw err;
    }

    var numRows = 0;
    try {
        numRows = AMPParse.buildSdnv(hexadecimal);
        nibblesConsumed += numRows.nibblesConsumed;
        numRows = numRows.returnValue.value;
    } catch (err) {
        err.nibblesConsumed += nibblesConsumed;
        err.message = "Could not extract number of rows for table: " + err.message;
        throw err;
    }

    var rows = [];
    for (var i = 0; i < numRows; i++) {
        try {
            var numRowObjs = AMPParse.buildSdnv(hexadecimal);
            nibblesConsumed += numRowObjs.nibblesConsumed;
            numRowObjs = numRowObjs.returnValue.value;
        } catch (err) {
            err.nibblesConsumed += nibblesConsumed;
            err.message = "Failed to get number of objects in the row: " + err.message;
            throw err;
        }

        // The number of items in a row must match the column count
        if (numRowObjs != colTypes.value.length) {
            var err = new RangeError("Row expects " + numRowObjs
                + " instead of " + colTypes.value.length);
            err.nibblesConsumed += nibblesConsumed;
            throw err;
        }

        var row = colTypes.value.map(function(typeByte) {
            try {
                var obj  = AMPParse.buildUndeclaredType(hexadecimal, typeByte.value);
                nibblesConsumed += obj.nibblesConsumed;
                return obj.returnValue;
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