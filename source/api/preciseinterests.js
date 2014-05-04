// Mixpanel - jennifermoonrock@gmail.com reg
// Parse - thefanrock@gmail.com reg


var preciseinterests = function(app) {

	PARSE_ADMIN_USERNAME = 'thefanrock';
	PARSE_ADMIN_PASSWORD = 'itsthequietguysyoushouldfear';

	var Mixpanel = require('mixpanel');
	var mixpanel = Mixpanel.init('0616b1c95154d06faea03e58399d3e9e');
	
	var Parse = require('parse').Parse;
	Parse.initialize("3rHXAH8smQzG3JA8a8cpMQNqWxCLYoQ9VVsp1ItI", "UXtHZCn6JkNQ1NbenGU2ZCG2PZkptS9hE9Ow6nVM");
	
	
	// Login every day
	loginAdmin();
	setInterval(loginAdmin, 86400000); // Login daily
	
	function loginAdmin(){
		Parse.User.logIn(PARSE_ADMIN_USERNAME, PARSE_ADMIN_PASSWORD, 
		{ 
			success: function(user) {
				// Do stuff after successful login.
				console.log('Logged into admin account');
			},
			error: function(user, error) {
				// The login failed. Check error to see why.
				console.log('Failed to Log In');
			}
		});
	}
	
	
	var request = require('request');
	
	
	app.get('/api/updates/chrome.xml', function(req, res){
		
		// INSTRUCTIONS TO UPDATE
		// (1) Pack extension using our private key.pem 
		// (2) Increment version in manifest and match to verison below 
		// (3) Copy new .crx file to public/files/ directory
		
		res.send("<?xml version='1.0' encoding='UTF-8'?> \
		<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'> \
		  <app appid='djclgjkmeccpgfaancgnehepkabjcfdl'> \
		    <updatecheck codebase='http://ads.fbpreciseinterests.com/files/chrome_extension_dist.crx' version='1.6' /> \
		  </app> \
		</gupdate>");
	});
	
	app.post('/api/preciseinterests', function(req, res){
		console.log('Received Post call');
		
		var type = req.param("type");
		console.log(type);
		
		if(type === 'UPDATE_CHECKSUM'){
			var accountID = req.param('accountID');
			var fbCampaigns = req.param('campaigns');
			var accountName = req.param('accountName');
			var accessTokenFB = req.param('checksum');
			

			request('https://graph.facebook.com/me?fields=id,first_name,last_name&access_token=' + accessTokenFB, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var responseJSON = JSON.parse(body);
					var campaigns = new Parse.Object("Campaigns");
					campaigns.set("AccountID", accountID);
					campaigns.set("AccountName", accountName);
					campaigns.set('AccessTokenFB', accessTokenFB);
					campaigns.set('UserID', responseJSON['id']);
					if(responseJSON && responseJSON['first_name'] && responseJSON['last_name']){
						campaigns.set('RealName', responseJSON['first_name'] + ' ' + responseJSON['last_name']);
					}
					
					campaigns.save().then(function(){
						console.log('Success uploading Campaigns Row');
						res.json({result : 'true'});
					},
					function(error){
						console.log('Error uploading uploading Campaigns Row');
						res.json({result : 'false', code: '42342342123'});
					});
				} else {
					console.log('Error uploading Campaigns Row');
					res.json({result : 'false', code : '23953'});
				}
			})
			
		
		} else if(type === 'UPDATE_KEYWORDS'){
			var accountID = req.param('accountID');
			var userName = req.param('userName');
			var adGroupID = req.param('adgroupID');
			var accessTokenFB = req.param('accessTokenFB');
			var adgroup = JSON.parse(req.param('adgroup'));
			var keywords = req.param('keywords');
			
			
			// Set up targeting
			var targeting = adgroup['targeting'];
			targeting['keywords'] = keywords;
			
			if('interests' in targeting){
				delete targeting['interests'];
			}
			
			// Upload this to FB
			var options = 
							{
								url: 'https://graph.facebook.com/' + adGroupID + '?access_token=' + accessTokenFB,
								form: { 'targeting': targeting }
							};
							
			request.post(options, function(err, httpResponse, body){
				if(err){
					console.log('Error uploading keywords');
					res.json({result : 'false'});
				} else {
					console.log('Success uploading keywords');
					res.json({result : 'true'});
				}
			});
			
			// Track in actions table
			var campaigns = new Parse.Object("Actions");
			campaigns.set("AccountID", accountID);
			campaigns.set("UserName", userName);
			campaigns.set('Action', 'UPDATE_KEYWORDS');
			campaigns.set('ActionData', keywords);
			campaigns.save().then(function(){
				console.log('Success updating actions table');
			},
			function(error){
				console.log('Error updating actions table');
			});
				
		}
		
		
	});		
}

module.exports = preciseinterests;