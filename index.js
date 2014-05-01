var express = require('express');
var router = express.Router();
var home = require(__dirname, 'play');
var sys = require('sys');
var messages = {'up_messages':[{'text': 'hi'}, {'text': 'how'}, {'text': 'are'}], 'down_messages': [{'text': 'down'}, {'text': 'mean'}, {'text': 'message'}]};


router.get('/', function(req, res){
	 res.render('play', { title: 'Express' });

});


router.get('/chats', function(req, res) {
	console.log("downloading chats from server");
	res.json(messages);
	//res.JSON(messages);
});



router.get('/addchat', function(req, res) {
	// console.log(req.query['direction_flag']);
	// if(req.query['direction_flag'] === "true"){
	// 	messages['up_messages'].push({'text': req.query['text']});
	// }
	// else{
	// 	messages['down_messages'].unshift({'text': req.query['text']});
	// }
	// res.json(messages);
});


module.exports = router;
