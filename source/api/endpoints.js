// Mixpanel - jennifermoonrock@gmail.com reg
// Parse - thefanrock@gmail.com reg

var ACCESS_TOKEN_FB = '497175490383456|ecced3cdcaf2c6660c01c58d6194615b'

var fbgraph = function(app) {
	
	var Parse = require('parse').Parse;
	Parse.initialize("CvY71dCUer2WarJf2Jwle8g9f9zYu2J0YsSjgMGu", "B3IIetxGt75GQPrz7jPYH9eugUK20o7PELo2ward");
	var sugar = require('sugar');
	var request = require('request');
	var MemJS = require("memjs").Client
	memjs = MemJS.create(false, {
		expires : 60 * 30, // Refresh every 30 minutes. Unit is in seconds
	});
	
	
	app.get('/api/contest/current', function(req, res){
		var result = {
			current : {
				"id" : '2',
				"event" : '123',
				"startDate" : Date.create('this sunday'),
				"endDate" : Date.create('this sunday').addDays(-7),
				"item" : {
					"img" : "fanrockapps.s3.amazonaws.com/contest/item-1.png",
					"title" : "Two Tickets to a Home Game!",
					'description' : 'June 2nd vs the San Franciso Giants'
				},
				"winner" : {
					"name" : "Melody M.",
					"img" : "fanrockapps.s3.amazonaws.com/contest/winner-1.png"
				}
			},

			previous : {
				'id' : '1',
				"event" : '231',
				"startDate" : Date.create('last sunday'),
				"endDate" : Date.create('last sunday').addDays(-7),
				"item" : {
					"img" : "fanrockapps.s3.amazonaws.com/contest/item-2.png",
					"title" : "Yadier Molina Jersey!",
					'description' : 'Authentic Yadier Molina Jersey'
				},
				"winner" : {
					"name" : "Jillian K.",
					"img" : "fanrockapps.s3.amazonaws.com/contest/winner-2.png"
				}
			}
		}
		res.json(result);
	});

	
	app.get('/api/fbgraph/*', function(req, res){
		
		if(req && req.params.length === 1){
			var requestPath = req.params[0]
		} else {
			res.send(500, 'Error');
			return;
		}
		
		// Handle our private url params
		if(req.query['bust_cache'] === 'TRUE'){
			var bustCache = true;
		};
		delete req.query['bust_cache'];
		
		
		// Add access token
		req.query['access_token'] = ACCESS_TOKEN_FB;
	
		// Generate query string with URL params
		var url = 'https://graph.facebook.com/' + requestPath;
		var urlParamKeys = Object.keys(req.query);
		if(urlParamKeys.length > 0){
			url = url + '?';
		}
		for(var i = 0; i < urlParamKeys.length; i++){
			var key = urlParamKeys[i];
			url = url + key + '=' + req.query[key];
			if(i != urlParamKeys.length - 1){
				url = url + '&';
			}
		}
		
		console.log(url);
		
		if(bustCache){
			console.log('Busting Cache');
			makeNewRequest();
		} else {
			// Check if this is in memcache
			memjs.get(url, function(err, val, key) {

				// If value exists, return it
				if(val){
					console.log('Returning cached data');
					var parsedValue = JSON.parse(val.toString());
					//console.log(parsedValue['body']);

					res.json(parsedValue['statusCode'], parsedValue['body']);
				} else { // If not, make new request and save to memcache
					console.log('Getting fresh data');
					makeNewRequest();
				}
			});
		}
		
		// Make call to FB and cache result
		function makeNewRequest(){
			request(url, function(error, response, body) {
				//console.log(body);
				var returnBody = JSON.parse(body);
				res.json(response.statusCode, returnBody);
				
				if(response.statusCode == 200){ // Only set cache if we get a succes
					memjs.set(url, JSON.stringify({'statusCode' : response.statusCode, 'body' : returnBody}));
				}
				
			});
		}
		
	});	
}

module.exports = fbgraph;