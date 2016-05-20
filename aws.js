var path = require('path')
	, fs = require('fs');

var AWS = require('aws-sdk');

// general settings
var awsBucket = 'klippings';
var destPath = path.join(__dirname, "data/my-clippings.txt");
var jsonPath = path.join(__dirname, "data/my-clippings.json");

// setup s3
var s3 = new AWS.S3();

// upload files to aws
uploadFile(destPath, "my-clippings.txt", function(err) {

	if(err) { throw new Error(err); }

	uploadFile(jsonPath, "my-clippings.json", function() {

		if(err) { throw new Error(err); }

		console.log("Uploaded to AWS!");
	});
});


function uploadFile(path, fileName, cb) {

	fs.readFile(path, function(err, data) {

		if(err) { throw new Error(err); }

		var params = {
			Bucket: awsBucket
			, Key: fileName
			, ACL: "public-read"
			, Body: data
		}

		s3.putObject(params, cb);		
	});

}