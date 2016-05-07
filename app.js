var express = require('express')
	, html = require('simple-html-index')
	, livereload = require('livereload')
	, klip = require('klip');


// load package info
var pkg = require('./package.json')

// setup app
var app = express();

var clientPath = __dirname + '/client';

// middleware
app
	// .use(require('less-middleware')(__dirname + '/client'))
	.use(require('node-sass-middleware')({src: clientPath}))
	.use(require('connect-livereload')({ port: 35729 }))
	.use(require('browserify-middleware')(clientPath, { transform: ['hbsfy'] }))
	.use(express.static('client'));

// root html
app.get('/', function(req, res, next) {
	html({
		title: pkg.name + ':' + pkg.version
		, entry: 'index.js'
		, css: 'styles.css'
	}).pipe(res);
});

app.get('/clippings', function(req, res, next) {
	klip.parse('data/My Clippings.txt', { pretty: true }, function(err, data) {
		if(err) throw new Error(err);
		else res.json(data);
	});
});

// start main server
app.listen(3000);

// livereload server
var server = livereload.createServer({
	exts: ['less', 'sass', 'js', 'html', 'css']
});
server.watch(clientPath);