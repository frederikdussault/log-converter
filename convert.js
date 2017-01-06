/*
Goal:
+ Read text file line by line using pipe

input -> upper -> add line number -> output

usage:
node convert.js FILTER < inputfilename > outputfilename

Parameters
FILTER : [,,,,,"4..",]  Represent every fields in logfile. Use strings for criteria
*/

console.time('run')

var filter = [,,,,,"4..",]
var sRegex = /^(\S+)\s+(\S+)\s+(\S+)\s+\[(.*)\]\s+\"(.*)\"\s+(\S+)\s+(\S+)\s+\"(.*)\"\s+\"(.*)\"$/
var sep = ','

if (process.argv[2]) {
    var filter = process.argv[2].split(',')
    console.log('Filter: ', filter)
}

var fs = require('fs')
var liner = require('modules/liner')
var Logger = require('modules/logger')

// TODO create a contructor that will set the log object filters
//var codeFilter = {}
//var logger = new log(codeFilter)

var log = new Logger(sRegex, filter, sep)

/*
var input = fs.createReadStream(inputFilename)
var output = fs.createWriteStream(outputFilename)
*/
var input = process.stdin
var output = process.stdout

input.pipe(liner).pipe(log.strm).pipe(output)

output.on('finish', () => { console.timeEnd('run') } )
