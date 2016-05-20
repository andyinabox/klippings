var path = require('path');
var Rsync = require('rsync');

var srcPath = "/Volumes/Kindle/documents/My Clippings.txt";
var destPath = path.join(__dirname, "data/my-clippings.txt");

// setup rsync
var sync = new Rsync()
	.flags('az')
	.source(srcPath)
	.destination(destPath);

sync.execute(function(err, code, cmd) {
	if(err) {
		throw new Error("Error code "+code+" for command "+cmd);
	}

	console.log("Clippings synced from Kindle");

});