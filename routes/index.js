var express = require('express');
var router = express.Router();
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');



/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { 
					anger: 0,
					disgust: 0,
					fear: 0,
					joy: 0,
					sadness: 0,
					confident: 0,
					tentative: 0,
					agreeableness: 0
	});
});


//router.post('/', async function(req, res, next) {
//	try {

// Your Google Cloud Platform project ID
const projectId = 'test-yhack17';

const record = require('node-record-lpcm16');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
 const encoding = 'Encoding of the audio file, e.g. LINEAR16';
 const sampleRateHertz = 16000;
 const languageCode = 'BCP-47 language code, e.g. en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false, // If you want interim results, set this to true
};

// Create a recognize stream
const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data =>
    process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : `\n\nReached transcription time limit, press Ctrl+C\n`
    )
  )
	;

// Start recording and send the microphone input to the Speech API
record
  .start({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: false,
    recordProgram: 'sox', // Try also "arecord" or "sox"
    silence: '10.0',
  })
  .on('error', console.error)
  .pipe(recognizeStream);

console.log('Listening, press Ctrl+C to stop.');
//}});

router.post('/', async function(req, res, next) {
	try {
		var tone_analyzer = new ToneAnalyzerV3({

			username: "e63b6787-9a8d-4bdf-9545-919a20ff234b",
			password: "CTmftBJLn12b",
			version_date: '2016-05-19'
		});

		tone_analyzer.tone({ text: req.body.message },
			function(err, tone) {
				if (err)
					console.log(err);
				else
					var data = JSON.stringify(tone, null, 2);
				var parsedData = JSON.parse(data);

				var anger = parsedData.document_tone.tone_categories[0].tones[0].score;
				var disgust = parsedData.document_tone.tone_categories[0].tones[1].score;
				var fear = parsedData.document_tone.tone_categories[0].tones[2].score;
				var joy = parsedData.document_tone.tone_categories[0].tones[3].score;
				var sadness = parsedData.document_tone.tone_categories[0].tones[4].score;
				var confident = parsedData.document_tone.tone_categories[1].tones[1].score;
				var tentative = parsedData.document_tone.tone_categories[1].tones[2].score;
				var agreeableness = parsedData.document_tone.tone_categories[2].tones[3].score;
				console.log(data);
				res.render('index', {
					anger: anger,
					disgust: disgust,
					fear: fear,
					joy: joy,
					sadness: sadness,
					confident: confident,
					tentative: tentative,
					agreeableness: agreeableness

				});

			});
		
	} catch (e) {
		console.log(e);

	}
});

module.exports = router;
