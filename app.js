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

server.listen(8045);

app.use(cookieParser());
app.use(bodyParser());

var socket_array = [];
io.sockets.on('connection', function(socket){
	console.log("In connection, hello kitty!")
	// if it's not in the array already....
	socket_array.push(socket);
	socket.emit('news', {hello: 'world'});
	socket.on('my other event', function(data){
		console.log("got handshake from socket");
		//console.log(data);
	});
	socket.on('message', function(data){
		console.log("here i am this is me");
		//console.log(data);
	});
});

io.sockets.on('name', function (data) {
	console.log("*****hitting  the add chat SOCKEt w");
        if(data.message) {
        	if(data.direction_flag == true){
				messages['up_messages'].push({text: data['text']});

        	}
        	else{
        		messages['down_messages'].unshift({text: data['text']});
        	}
        	broadcast_messages();
        } else {
            console.log("There is a problem:", data);
        }
        console.log("jflksjdflksjf");
});


var broadcast_messages = function(){
	for(var i = 0; i< socket_array.length; i++){

	}
	
};

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'views')));
app.use('/', routes);

var port = process.env.PORT || 5040;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

module.exports = app;
