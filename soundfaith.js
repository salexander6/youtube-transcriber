var Promise = require('bluebird');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var request = require("request");
var fs = require('fs');

exports.getSoundFaithAudio = function(sermonId){
	return new Promise(function(resolve, reject){
    console.log('Getting SoundFaith audio URI for sermon ' + sermonId + '...')
    var url = 'https://soundfaith.com/api/sermons/' + sermonId;
    var dir = './sermons';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    
    request({
        url: url,
        json: true
    }, function (error, response, sermon) {

        if (!error && response.statusCode === 200) {
            var audio = sermon.assets.recording.url;
            console.log('Downloading SoundFaith audio...'); 
            var mp3File = path.join(dir, + sermonId + '.mp3');

            var stream = request
              .get(audio)
              .pipe(fs.createWriteStream(mp3File))
              .on('finish', function () { 
                var flacFile = path.join(dir, sermonId + '.flac');
                console.log('Converting to FLAC...');
                ffmpeg(mp3File)
                  .output(flacFile)
                  .on('end', function(){
                    resolve();
                  })
                  .on('error', function(err){
                    reject(err);
                  })
                  .run();
               });
        }
        else
        {
          console.log('Error retrieving sermon - ' + url);
        }
    });
  });
};
