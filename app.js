var express = require('express');
var path = require('path');
var jade = require('jade');
var bodyParser = require('body-parser');
var routes = require('./index');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var app = require('express')()
	, server = require('http').createServer(app);

var http = require('http');
var key = require('./key.js');
server.listen(8045);
var messages = {'up_messages':[], 'down_messages': []};
var classify = require('./classify');
var get_classification = classify.get_classification;
console.log("get_classification is",get_classification);
var prob_dict = classify.prob_dict;

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



var io = require('socket.io').listen(server);
io.set('log level', 1);
var socket_array = [];

io.sockets.on('connection', function(socket){
	socket_array.push(socket);
	socket.on('client_data', function(data){
   		if(get_classification(data.message, prob_dict) === true){
		messages['up_messages'].push({'text': data.message});
		}
		else{
			messages['down_messages'].unshift({'text': data.message});
		}
		for(var i =0; i< socket_array.length; i++){
			socket_array[i].emit('message', messages);
		}
 
 });

});


module.exports = app;
