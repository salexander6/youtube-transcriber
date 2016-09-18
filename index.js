var watson = require('./watson');
var soundfaith = require('./soundfaith');
var path = require('path');

var flags = process.argv.slice(2);

if(flags[0] === 'transcribe'){
	soundfaith.getSoundFaithAudio(flags[1])
		.then(watson.watsonSpeechToText.bind(this, 
			path.join('./sermons/' + flags[1] + '.flac'),
			path.join('./sermons/' + flags[1] + '.txt')))
		.then(function(){
			console.log('Done transcribing video id: ' + flags[1]);
		});
}
