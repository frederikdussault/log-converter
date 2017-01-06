var stream = require('stream')
var array_to_csv_formater = function (sep = '|') {
    this.sep = sep

    this.strm = new stream.Transform({objectMode: true})

    // Receive and array and converts it in CVS separated string
    this.strm._transform = (data_array, encoding, callback) => { // Lexical this is parent
        var sCSV = ""

        if (data_array) {
            // console.log("arr:\n" + data_array + "\n");

            sCSV = this.formatCSV(data_array, this.sep) + "\n";
            // console.log("sCSV:\n" + sCSV + "\n\n");

            this.strm.push(sCSV)
        }

        callback()
    }

    this.strm._flush = (callback) => {
        callback()
    }


    /* ------------------------------ */


    this.formatCSV = function(recordArray) {
        var textLine = ""

        for (var v of recordArray) {

            if (textLine) 
                textLine += this.sep

            var toWrap = ((v.search(/[\s]/) > -1) || v.includes(this.sep))

            if (toWrap) {
                // There is a space or a coma or semi-column - Wrap value in quotes
                textLine += `"${v}"`
            } else {
                textLine += `${v}`
            }
        }

        return textLine
    }

} 

module.exports = array_to_csv_formater