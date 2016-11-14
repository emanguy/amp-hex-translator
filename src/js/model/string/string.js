var AMPParse = AMPParse || {};

AMPParse.buildString = function (hexadecimal) {

    var lookupTable = {
	"00": function() {
	    return "<NUL>";
	},
	"01": function() {
	    return "<SOH>";
	},
	"02": function() {
	    return "<STX>";
	},
	"03": function() {
	    return "<ETX>";
	},
	"04": function() {
	    return "<EOT>";
	},
	"05": function() {
	    return "<ENQ>";
	},
	"06": function() {
	    return "<ACK>";
	},
	"07": function() {
	    return "<BEL>";
	},
	"08": function() {
	    return "<BS>";
	},
	"09": function() {
	    return "<HT>";
	},
	"0A": function() {
	    return "<LF>";
	},
	"0B": function() {
	    return "<VT>";
	},
	"0C": function() {
	    return "<FF>";
	},
	"0D": function() {
	    return "<CR>";
	},
	"0E": function() {
	    return "<SO>";
	},
	"0F": function() {
	    return "<SI>";
	},
	"10": function() {
	    return "<DLE>";
	},
	"11": function() {
	    return "<DC1>";
	},
	"12": function() {
	    return "<DC2>";
	},
	"13": function() {
	    return "<DC3>";
	},
	"14": function() {
	    return "<DC4>";
	},
	"15": function() {
	    return "<NAK>";
	},
	"16": function() {
	    return "<SYN>";
	},
	"17": function() {
	    return "<ETB>";
	},
	"18": function() {
	    return "<CAN>";
	},
	"19": function() {
	    return "<EM>";
	},
	"1A": function() {
	    return "<SUB>";
	},
	"1B": function() {
	    return "<ESC>";
	},
	"1C": function() {
	    return "<FS>";
	},
	"1D": function() {
	    return "<GS>";
	},
	"1E": function() {
	    return "<RS>";
	},
	"1F": function() {
	    return "<US>";
	},
	"20": function() {
	    return " ";
	},
	"21": function() {
	    return "!";
	},
	"22": function() {
	    return "\"";
	},
	"23": function() {
	    return "#";
	},
	"24": function() {
	    return "$";
	},
	"25": function() {
	    return "%";
	},
	"26": function() {
	    return "&";
	},
	"27": function() {
	    return "\'";
	},
	"28": function() {
	    return "(";
	},
	"29": function() {
	    return ")";
	},
	"2A": function() {
	    return "*";
	},
	"2B": function() {
	    return "+";
	},
	"2C": function() {
	    return ",";
	},
	"2D": function() {
	    return "-";
	},
	"2E": function() {
	    return ".";
	},
	"2F": function() {
	    return "/";
	},
	"30": function() {
	    return "0";
	},
	"31": function() {
	    return "1";
	},
	"32": function() {
	    return "2";
	},
	"33": function() {
	    return "3";
	},
	"34": function() {
	    return "4";
	},
	"35": function() {
	    return "5";
	},
	"36": function() {
	    return "6";
	},
	"37": function() {
	    return "7";
	},
	"38": function() {
	    return "8";
	},
	"39": function() {
	    return "9";
	},
	"3A": function() {
	    return ":";
	},
	"3B": function() {
	    return ";";
	},
	"3C": function() {
	    return "<";
	},
	"3D": function() {
	    return "=";
	},
	"3E": function() {
	    return ">";
	},
	"3F": function() {
	    return "?";
	},
	"40": function() {
	    return "@";
	},
	"41": function() {
	    return "A";
	},
	"42": function() {
	    return "B";
	},
	"43": function() {
	    return "C";
	},
	"44": function() {
	    return "D";
	},
	"45": function() {
	    return "E";
	},
	"46": function() {
	    return "F";
	},
	"47": function() {
	    return "G";
	},
	"48": function() {
	    return "H";
	},
	"49": function() {
	    return "I";
	},
	"4A": function() {
	    return "J";
	},
	"4B": function() {
	    return "K";
	},
	"4C": function() {
	    return "L";
	},
	"4D": function() {
	    return "M";
	},
	"4E": function() {
	    return "N";
	},
	"4F": function() {
	    return "O";
	},
	"50": function() {
	    return "P";
	},
	"51": function() {
	    return "Q";
	},
	"52": function() {
	    return "R";
	},
	"53": function() {
	    return "S";
	},
	"54": function() {
	    return "T";
	},
	"55": function() {
	    return "U";
	},
	"56": function() {
	    return "V";
	},
	"57": function() {
	    return "W";
	},
	"58": function() {
	    return "X";
	},
	"59": function() {
	    return "Y";
	},
	"5A": function() {
	    return "Z";
	},
	"5B": function() {
	    return "[";
	},
	"5C": function() {
	    return "\\";
	},
	"5D": function() {
	    return "]";
	},
	"5E": function() {
	    return "^";
	},
	"5F": function() {
	    return "_";
	},
	"60": function() {
	    return "`";
	},
	"61": function() {
	    return "a";
	},
	"62": function() {
	    return "b";
	},
	"63": function() {
	    return "c";
	},
	"64": function() {
	    return "d";
	},
	"65": function() {
	    return "e";
	},
	"66": function() {
	    return "f";
	},
	"67": function() {
	    return "g";
	},
	"68": function() {
	    return "h";
	},
	"69": function() {
	    return "i";
	},
	"6A": function() {
	    return "j";
	},
	"6B": function() {
	    return "k";
	},
	"6C": function() {
	    return "l";
	},
	"6D": function() {
	    return "m";
	},
	"6E": function() {
	    return "n";
	},
	"6F": function() {
	    return "o";
	},
	"70": function() {
	    return "p";
	},
	"71": function() {
	    return "q";
	},
	"72": function() {
	    return "r";
	},
	"73": function() {
	    return "s";
	},
	"74": function() {
	    return "t";
	},
	"75": function() {
	    return "u";
	},
	"76": function() {
	    return "v";
	},
	"77": function() {
	    return "w";
	},
	"78": function() {
	    return "x";
	},
	"79": function() {
	    return "y";
	},
	"7A": function() {
	    return "z";
	},
	"7B": function() {
	    return "{";
	},
	"7C": function() {
	    return "|";
	},
	"7D": function() {
	    return "}";
	},
	"7E": function() {
	    return "~";
	},
	"7F": function() {
	    return "<DEL>";
	}
    }
    
    nibblesUsed = 0; //int
    nullTerminate = false; //bool
    returnString = ""; //string
    tempChars = "00";
    
    // Defensive programming
    if (typeof hexadecimal !== "string") {
	throw new ReferenceError("Provided parameter does not exist or is not a string");
    }
    tempChars = hexadecimal.substring(0, 2);
    if (tempChars == "00") {
	nullTerminate = true;
	returnString = "";
    }

    // Find length of string
    while (!nullTerminate) {
	tempChars = hexadecimal.substring(nibblesUsed, nibblesUsed+2);
	if (tempChars != "00") {
 	    nibblesUsed++;
	    nibblesUsed++;
	    returnString += lookupTable[tempChars]();
	}
	else {
	    nullTerminate = true;
	}
    }
    
    // Snag the relevant bytes and build return value object
    var returnValue = {
	type: "String",
	value: returnString
    };
    
    // Return object according to spec
    return {
	returnValue: returnValue,
	nibblesConsumed: nibblesUsed,
	trailingHex: hexadecimal.substring(nibblesUsed+2)
    };
}
