// Mixpanel - jennifermoonrock@gmail.com reg
// Parse - thefanrock@gmail.com reg

var ACCESS_TOKEN_FB = '497175490383456|ecced3cdcaf2c6660c01c58d6194615b'

var fbgraph = function(app) {
	var Parse = require('parse').Parse;
	Parse.initialize("CvY71dCUer2WarJf2Jwle8g9f9zYu2J0YsSjgMGu", "B3IIetxGt75GQPrz7jPYH9eugUK20o7PELo2ward");
	
	var request = require('request');
	
	
	app.get('/api/fbgraph/*', function(req, res){
		
		if(req && req.params.length === 1){
			var requestPath = req.params[0]
		} else {
			res.send(500, 'Error');
			return;
		}
		
		var url = 'https://graph.facebook.com/' + requestPath;
		req.query['access_token'] = ACCESS_TOKEN_FB; // Set access token 
	
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
		

		
		// If not, make new request
		
		request(url, function(error, response, body) {
			console.log(body);
			var returnBody = JSON.parse(body);
			res.json(response.statusCode, returnBody);
		});
		
	});	
}

module.exports = fbgraph;