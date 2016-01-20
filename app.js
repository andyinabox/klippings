var express = require('express')
	, html = require('simple-html-index')
	, livereload = require('livereload')
	, klip = require('klip');


// load package info
var pkg = require('./package.json')

// setup app
var app = express();

// middleware
app
	.use(require('less-middleware')(__dirname + '/client'))
	.use(require('connect-livereload')({ port: 35729 }))
	.use(require('browserify-middleware')(__dirname + '/client'))
	.use(express.static('client'));

// root html
app.get('/', function(req, res, next) {
	html({
		title: pkg.name + ':' + pkg.version
		, entry: 'index.js'
		, css: 'styles.css'
	}).pipe(res);
});

// start main server
app.listen(3000);

// livereload server
var server = livereload.createServer({
	exts: ['less', 'js', 'html', 'css']
});
server.watch(__dirname + "/client");