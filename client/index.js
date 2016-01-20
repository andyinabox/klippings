var jQuery = require('jquery-browserify')
	, lodash = require('lodash');

// templates
var clippingTpl = require('./clipping.hbs');

var req = jQuery.getJSON('/clippings');

jQuery(function() {
	console.log('dom ready');
	req.then(loaded);
})

function loaded(data) {
	console.log('data loaded');
	data.forEach(eachClipping);
}

function eachClipping(clipping) {
	$('body').append(clippingTpl(clipping));
}

