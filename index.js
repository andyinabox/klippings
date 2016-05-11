var Handlebars = require("hbsfy/runtime");

var layoutTpl = require('./templates/layout.hbs');
var titleTpl = require('./templates/title.hbs');
var clippingTpl = require('./templates/clipping.hbs');

// this is a polyfill that gets attached to browser global
require('whatwg-fetch');
var fetch = window.fetch;

Handlebars.registerPartial('clipping', clippingTpl);

var JSON_URL = "https://s3.amazonaws.com/klippings/my-clippings.json"

function parseJSON(response) {
	return response.json();
}

function stringToDom(str) {
	var e = document.createElement('div');
	e.innerHTML = str;
	return e.firstChild;
}

// var h1 = document.createElement('h1')
// h1.innerHTML = 'klippings';

// document.body.appendChild(h1);

var main;

fetch(JSON_URL).then(parseJSON).then(function(body) {

	document.body.appendChild(stringToDom(layoutTpl({
		titleCount: body.titles.length
	})));

	main = document.getElementById('main');


	var titlesContainer = document.createElement('div');

	body.titles.forEach(function(title) {
		var titleEl = stringToDom(titleTpl(title));
		var h2 = titleEl.getElementsByTagName('h2')[0];
		var clippings = titleEl.getElementsByClassName('clippings')[0];

		h2.onclick = function() {
			clippings.classList.toggle('hidden');
		};

		titlesContainer.appendChild(titleEl);
	});



	document.body.appendChild(titlesContainer);
});