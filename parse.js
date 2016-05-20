var path = require('path')
	, fs = require('fs')
	, klip = require('klip')
	, _ = require('underscore');

// general settings
var destPath = path.join(__dirname, "data/my-clippings.txt");
var jsonPath = path.join(__dirname, "data/my-clippings.json");

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

});
