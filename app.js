var express = require('express');
var path = require('path');
var jade = require('jade');
var bodyParser = require('body-parser');
var routes = require('./index');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var app = require('express')()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server);
var http = require('http');
var key = require('./key.js');
server.listen(8045);

app.use(cookieParser());
app.use(bodyParser());





//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'views')));
app.use('/', routes);

var port = process.env.PORT || 5040;
app.listen(port, function() {
  console.log('Listening on ' + port);
});


var OAuth = require('oauth').OAuth;

var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	key.consumer_key,
	key.consumer_secret,
	"1.0",
	"http://10.0.3.143:5040/auth/twitter/callback",
	"HMAC-SHA1"
);

app.get('/setuptwitter', function(req, res){
	res.render('gototwitter', { title: 'Express' });

});


app.get('/auth/twitter', function(req, res) {
	console.log("hitting auth/twitter");
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
		if (error) {
			console.log(error);
			res.send("yeah no. didn't work.")
		} else {
			req.session.oauth = {};
			req.session.oauth.token = oauth_token;
			console.log('oauth.token: ' + req.session.oauth.token);
			req.session.oauth.token_secret = oauth_token_secret;
			console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
			res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token)
		}
	});
});

var twitter = require('ntwitter');
app.get('/auth/twitter/callback', function(req, res, next) {
	if (req.session.oauth) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;

		oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
			function(error, oauth_access_token, oauth_access_token_secret, results) {
				if (error) {
					console.log(error);
					res.send("yeah something broke.");
				} else {
					req.session.oauth.access_token = oauth_access_token;
					req.session.oauth.access_token_secret = oauth_access_token_secret;
					console.log(results);
					//console.log(req);
					var twit = new twitter({
						consumer_key: "A6x1nzmmmerCCmVN8zTgew",
						consumer_secret: "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
						access_token_key: req.session.oauth.access_token,
						access_token_secret: req.session.oauth.access_token_secret
					});


					twit
						.verifyCredentials(function(err, data) {
							console.log(err, data);
						})
						.updateStatus('Test tweet from ntwitter/' + twitter.VERSION,
							function(err, data) {
								console.log(err, data);
								res.redirect('/');
							}
					);

				}
			}
		);
	} else
		next(new Error("you're not supposed to be here."))
});





module.exports = app;
