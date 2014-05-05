var express = require('express');
var http = require('http');
var path = require('path');
var middleware = require('./source/middleware');

var app = express();

var oneMonth = 2678400000;

app.use(allowCrossDomain); // Allow cross domain requests 

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});

app.configure('development', function(){
	app.use(express.errorHandler());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(middleware.serveMaster.development());
});

app.configure('production', function(){
	app.use(express.compress());
	app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneMonth }));
	app.use(middleware.serveMaster.production());
});

// api endpoints
require('./source/api/endpoints')(app);


var port = app.get('port');
if(process.env.NODE_ENV === 'development'){
	var port = 80;
}

http.createServer(app).listen(port, function(){	 
	var environment = process.env.NODE_ENV || 'development';
	console.log('FanRock started: ' + port + ' (' + environment + ')');
});

function allowCrossDomain(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	}
	else {
		next();
	}
};
