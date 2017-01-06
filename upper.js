/*  I understand this:
Pulls from readable stream intochunk
Push to writable with this.push.bind(this)
*/


var stream = require('stream')
var upper = new stream.Transform({objectMode: true})

upper._transform = function (chunk, encoding, callback) {
     var data = chunk.toString().toUpperCase()
     this.push(data) 
     callback()
}

/*
What is the _lastLineData stuff all about? 
We don’t want a chunk of data to get cut off in the middle of a line.  
In order to avoid that, we splice out the last line we find so it does not push to the consumer.  
When a new chunk comes in we prepend the line data to the front and continue.  
This way we can safeguard against half lines being pushed out.
*/

upper._flush = function (callback) {
     callback()
}

/*
We push out the _lastLineData provided if we have some to the consumer and 
then cleanup our instance variable.  
Finally, we call callback() to signal that we are finished flushing.  
This will also signal to the consumer that the stream has ended.  
Remember, the _flush method is optional and may be unnecessary for some Transform streams.
*/

module.exports = upper