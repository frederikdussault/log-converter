const EventEmitter = require('events');
const ee = new EventEmitter();

var stream = require('stream')
var logger = function (sRegex, filter = null, sep = '|') {
    this.sRegex = sRegex
    this.filter = filter
    this.sep = sep

    this.strm = new stream.Transform({objectMode: true})

    this.strm._transform = (chunk, encoding, callback) => { // Lexical this is parent
        var aFields = [] 
        var sCSV = ""

        if (chunk) {
            aFields = this.explode(chunk)
            // console.log("arr:\n" + aFields + "\n");

            if (aFields) {
                // TODO - filter
                if (this.match(aFields)){
                    sCSV = this.formatCSV(aFields, this.sep) + "\n";
                    // console.log("sCSV:\n" + sCSV + "\n\n");

                    this.strm.push(sCSV)
                }
            }
        }

        callback()
    }

    this.strm._flush = (callback) => {
        callback()
    }


    /* ------------------------------ */


    /*
    Log line parts
    1) Address : cpe000c6e55e2c0-cm0011aefd39d4.cpe.net.cable.rogers.com
    2) Unknown : - (means no data received)
    3) Unknown : - (means no data received)
    4) Date/time : [10/May/2011:16:14:12 -0400]
    5) Transaction : "GET /ads/2011/che/loccitane/CHE_Loccitane_Banner_230x90.jpg HTTP/1.1"
    6) Http Response : 200 or 304 or other number
    7) Byte returned : 11605 or - (if no byte returned)
    8) Referer : "http://www.todaysparent.com/toddler/article.jsp?content=1241&page=1"
    9) Client Information : "Mozilla/4.0 (compatible; MSIE 7.0; America Online Browser 1.1; Windows NT 5.1; Trident/4.0; GTB6.5; .NET CLR 1.1.4322; BRI/1)"

    Reg exp groups
    (no-white) ((Unknown) (Unknown)) [(whatever-chars)] "(whatever-chars)" (no-white) (no-white) "(whatever-chars)" "(whatever-chars)"
    */

    this.match = function(aFields) {
        /*
            Receive a array of log fields and check it against filter array

            parameters
                aFields As array of log fields,
            Dependencies
                this.filter
            Returns
                Boolean
        */

        // Check Array not null
        //console.log(this.filter)
 
        var match = true  // will get false if there is not unmatch
        var aFilter = this.filter

        // Loop on all object of filter  - not important of array are not of same length. if fields array smaller than filter one, stop loop 
        for (var i = 0; i < aFilter.length && i < aFields.length; i++) {
            // console.log('aFilter[%d/%d]: %s   aFields[%d/%d]: %s ', i, aFilter.length, aFilter[i], i, aFields.length, aFields[i])

            // if filter[x] not null
            if (aFilter[i] !== undefined) {
                // if aFields[x] match filter[x]
                    re = new RegExp(aFilter[i], 'i')

                    if (!re) {
                        ee.emit('error', new Error('Error: Invalid regular expression applied'))

                        return []
                    } 

                    match = match && re.test(aFields[i])

                    // console.log('Match?   ', match)
            }
        }

        return match;
    }

    this.explode = function(textLine) {
        /*
            Receive a log line and transform it in array

            parameters
                TextLine As String,
                filter As object
            Returns
                Array
        */

        var matchCollection = this.sRegex.exec(textLine); // Array of log information
        if (!matchCollection) {
            ee.emit('error', new Error('Error: Invalid regular expression applied'))

            return []
        } 
        matchCollection.shift();

        //console.log(matchCollection);
        //console.log("filterCode: " + filterCode);

        return matchCollection;
    }

    this.formatCSV = function(recordArray) {
        var textLine = "";
        //if (!this.sep) { this.sep = ','; }  // Defaulted in constructor 

        for (var v of recordArray) {

            if (textLine) textLine += this.sep;

            var toWrap = ((v.search(/[\s]/) > -1) || v.includes(this.sep));

            if (toWrap) {
                // There is a space or a coma or semi-column - Wrap value in quotes
                textLine += `"${v}"`;
            } else {
                textLine += `${v}`;
            }
        }

        return textLine;
    }



} 

module.exports = logger
