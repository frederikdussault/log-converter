/*
Goal:
+ Read text file line by line using pipe

input -> upper -> add line number -> output

usage:
node convert.js FILTER < inputfilename > outputfilename

Parameters
FILTER : ,,,,,"4..",  Represent every fields in logfile. Use strings for criteria.  This example filter all lines with http code 400
*/

console.time('run')

var filter = [,,,,,,,,]
var sRegex = /^(\S+)\s+(\S+)\s+(\S+)\s+\[(.*)\]\s+\"(.*)\"\s+(\S+)\s+(\S+)\s+\"(.*)\"\s+\"(.*)\"$/
var sep = ','

if (process.argv[2]) {
    var filter = process.argv[2].split(',')
    //console.log('Filter: ', filter)
}

var fs = require('fs')
var liner = require('./modules/liner')

///TODO replace the following with log_exploder and array_to_csv
//var Logger = require('./modules/logger')
//var log = new Logger(sRegex, filter, sep)

var Exploder = require('./modules/log_exploder')
var logExploder = new Exploder(sRegex, filter)

var Formater = require('./modules/array_to_csv')
var csvFormater = new Formater(sep)

/*
var input = fs.createReadStream(inputFilename)
var output = fs.createWriteStream(outputFilename)
*/
var input = process.stdin
var output = process.stdout

//input.pipe(liner).pipe(log.strm).pipe(output)
input.pipe(liner).pipe(logExploder.strm).pipe(csvFormater.strm).pipe(output)

output.on('finish', () => { console.timeEnd('run') } )
