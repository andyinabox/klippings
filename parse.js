var path = require('path')
	, fs = require('fs')
	, Rsync = require('rsync')
	, AWS = require('aws-sdk')
	, klip = require('klip')
	, _ = require('underscore');

// general settings
var awsBucket = 'klippings';
var srcPath = "/Volumes/Kindle/documents/My Clippings.txt";
var destPath = path.join(__dirname, "data/my-clippings.txt");
var jsonPath = path.join(__dirname, "data/my-clippings.json");

// setup s3
var s3 = new AWS.S3();

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

	var organizeFn = function(parsed) {
		var key = "title"
			, organized = []
			, uniqueValues = _.chain(parsed).pluck(key).uniq().value();

		// find unique keys, organize them into a new array
		uniqueValues.forEach(function(value, index){
			var obj = {};



			// set the main key
			obj[key] = value;

			// query for related items
			obj.clippings = _.where(parsed, obj);

			// add an index
			obj.id = index;

			// add to our resultant object
			organized.push(obj);
		});

		return { titles: organized };		
	}


	var klipOpts = {
		pretty: true
		, organizeBy: organizeFn
	}


	klip.exportJson(destPath, jsonPath, klipOpts, function(err) {
		if(err) { throw new Error(err); }

		console.log("Clippings parsed and saved as json");

		


		// upload files to aws
		uploadFile(destPath, "my-clippings.txt", function(err) {

			if(err) { throw new Error(err); }

			uploadFile(jsonPath, "my-clippings.json", function() {

				if(err) { throw new Error(err); }

				console.log("Uploaded to AWS!");
			});
		});

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
