// to do:
// remove stop words
// get a lot bigger of a corpus
// figure out smoothing and rating better
// put bottom function in a closure



var fs = require('fs');
require.extensions['.txt'] = function(module, filename){
	module.exports = fs.readFileSync(filename, 'utf-8');
}

//read file to string
var read_in_file = function(file_name){
	var string = require(file_name);
	return string;
}

//gets rid of non-alphabetic characters
// leaves in apostrophes
var only_lower_letters = function(text){
	text = text.replace(/[^a-zA-Z ']+/gm, ' ').toLowerCase();
	//text = text.replace(/(\n)/gm, ' ');
	return text;
}

// returns a dictionary of how many times that word was used.
var count_words = function(text){
	var word_array = [];
	var word_dict = {};
	word_array = text.split(' ');
	//console.log(word_array);
	for(var i=0; i<word_array.length; i++){
		var in_dict = false;
		for(word in word_dict){
			if(word_dict.hasOwnProperty(word)){
				if (word === word_array[i]){
					in_dict = true;
					word_dict[word] +=1
				}
			}
		}
		if(in_dict === false){
			word_dict[word_array[i]] = 1;
		}
		in_dict = false;
	}// end outer for loop
	return word_dict
}

// returns a dictionary where keys are words and
// values are probabilities that word is in a "good" document
var word_probabilities = function(good_dict, bad_dict){
	var prob_dict = {};
	// go through good dict, taking words it has in common w
	// bad dict, adding them 
	for(word in good_dict){
		if(good_dict.hasOwnProperty(word)){
			if(bad_dict[word] != undefined){
				var good_count = good_dict[word];
				var bad_count = bad_dict[word];
				prob_dict[word] = good_count+1/ (good_count+bad_count);
				delete bad_dict[word];
			}
			else {// word is not in bad dict
				prob_dict[word] = 2;
			}
		}
	}// end loop over good dict
	for(word in bad_dict){
		if(bad_dict.hasOwnProperty(word)){
			prob_dict[word] = 0;
		}
	}
	return prob_dict;
}


var buid_dict_from_file = function(good_file_name, bad_file_name){
	bad_string = read_in_file(bad_file_name);
	bad_clean_string = only_lower_letters(bad_string);
	bad_dict = count_words(bad_clean_string);

	good_string = read_in_file(good_file_name);
	good_clean_string = only_lower_letters(good_string);
	good_dict = count_words(good_clean_string);
	console.log(good_dict);
	both_dict = word_probabilities(good_dict, bad_dict);
	return both_dict;
	//console.log(both_dict);

}

//var prep_dict = function(good_file_name, bad_file_name){
	//var prob_dict = buid_dict_from_file(good_file_name, bad_file_name);
	//console.log('prob_dict');
	
	var get_classification = function(text, prob_dict){
		var text = text.replace(/[^a-zA-Z ']+/gm, ' ').toLowerCase();
		var text_array = text.split(' ');
		console.log("text array is: ", text_array);
		var accum = 0;
		for(var i = 0; i< text_array.length; i++){
			if(prob_dict[text_array[i]]!= undefined){
				accum+= prob_dict[text_array[i]];
			}
		}
		var rating = accum/(text_array.length*2);
		console.log(text_array, "-- ", rating);
		if(rating > .7){
			return true;
		}
		else{
			return false;
		}
	}
//}
var prob_dict = buid_dict_from_file('./oprah.txt', './jersey.txt');
console.log(prob_dict);

console.log("hi from classifyer");
//console.log()
exports.get_classification = get_classification;
exports.prob_dict = prob_dict;