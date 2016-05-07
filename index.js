

// this is a polyfill that gets attached to browser global
require('whatwg-fetch');
var fetch = window.fetch;

var JSON_URL = "https://s3.amazonaws.com/klippings/my-clippings.json"

function parseJSON(response) {
	return response.json();
}

var h1 = document.createElement('h1')
h1.innerHTML = 'klippings';

document.body.appendChild(h1);

fetch(JSON_URL).then(parseJSON).then(function(body) {

	var titlesContainer = document.createElement('div');

	body.titles.forEach(function(title) {
		var div = document.createElement('div');
		var h2 = document.createElement('h2');
		var clippingsContainer = document.createElement('div');
		
		div.className = 'title';
		clippingsContainer.className = 'clippings hidden';

		// set title
		h2.innerHTML = title.title

		h2.onclick = function() {
			clippingsContainer.classList.toggle('hidden');
		}

		title.clippings.forEach(function (clipping) {
			var c = document.createElement('div');
			var bq = document.createElement('blockquote');

			c.className = 'clipping';
			bq.innerHTML = clipping.content;

			c.appendChild(bq);
			clippingsContainer.appendChild(c);
		});

		div.appendChild(h2);
		div.appendChild(clippingsContainer);
		titlesContainer.appendChild(div);
	});

	document.body.appendChild(titlesContainer);
});