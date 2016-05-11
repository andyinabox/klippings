var path = require('path')
	, fs = require('fs')
	, AWS = require('aws-sdk')
	, klip = require('klip')
	, _ = require('underscore');

// general settings
var awsBucket = 'klippings';
var destPath = path.join(__dirname, "data/my-clippings.txt");
var jsonPath = path.join(__dirname, "data/my-clippings.json");

// setup s3
var s3 = new AWS.S3();

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

		obj.author = obj.clippings[0].author;

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
