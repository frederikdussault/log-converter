# log-converter

Node.js app to filter and extract data from Apache logs

In its present state, you need to fetch the log file on your local.

## Goal:

Read text file line by line using pipes

    input -> upper -> add line number -> output

## usage:

```
node convert.js FILTER < inputfilename > outputfilename
```

## Parameters

__FILTER__: You may filter the exported content with comma separated values (live cvs files)
Represent every fields in logfile. Use strings for criteria.

eg: ,,,,,"4..",  
This example filter all lines with http code 400

## Installation

### Node Dependencies

bignumber.js
core-util-is
inherits
isarray
readable-stream
string_decoder

__Needed for connection with mysql connector
mysql
sqlstring

