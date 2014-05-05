var express = require('express');
var router = express.Router();
var home = require(__dirname, 'play');
var sys = require('sys');
var messages = {'up_messages':[], 'down_messages': []};
var classify = require('./classify');
var get_classification = classify.get_classification;
var prob_dict = classify.prob_dict;
//console.log('classify s ', classify );
//console.log('gc is ', get_classification);


router.get('/', function(req, res){
	 res.render('play', { title: 'Express' });

});


router.get('/chats', function(req, res) {
	res.json(messages);
});



router.get('/addchat', function(req, res) {
	var chat_text = req.query['text'];
	if(get_classification(chat_text, prob_dict) === true){
		messages['up_messages'].push({'text': chat_text});
	}
	else{
		messages['down_messages'].unshift({'text': chat_text});
	}
	res.json(messages);
});


module.exports = router;
