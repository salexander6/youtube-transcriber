var watson = require('watson-developer-cloud');
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');

var speech_to_text = watson.speech_to_text({
  password: "XAxkdULqz4zz",
  username: "a22a55e6-f7c3-41b3-b6b1-4a4716e234a0",
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',

});

exports.watsonSpeechToText = function(audioFile, transcriptFile) {

  return new Promise(function(resolve, reject) {

    var params = {
      content_type: 'audio/flac',
      timestamps: true,
      continuous: true,
      interim_results: true
    };

    // Create the stream.
    var recognizeStream = speech_to_text.createRecognizeStream(params);

    // Pipe in the audio.
    fs.createReadStream(audioFile).pipe(recognizeStream);

    // Pipe out the transcription to a file.
    recognizeStream.pipe(fs.createWriteStream(transcriptFile));

    // Get strings instead of buffers from 'data' events.
    recognizeStream.setEncoding('utf8');

    // Listen for events.
    recognizeStream.on('data', function(event) { onEvent('Data:', event); });
    recognizeStream.on('results', function(event) { onEvent('Results:', event); });
    recognizeStream.on('error', function(event) { onEvent('Error:', event); });
    recognizeStream.on('close-connection', function(event) { onEvent('Close:', event); });

    // Displays events on the console.
    function onEvent(name, event) {
        console.log(name, JSON.stringify(event, null, 2));
    };
  });
};