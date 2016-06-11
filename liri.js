var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var command = process.argv[2];
var logResult;

var userPick = function(){
  switch(command){
    case 'my-tweets':
      tweets();
      break;
    case 'spotify-this-song':
      songSearch();
      break;
    case 'movie-this':
      movieInfo();
      break;
    case 'do-what-it-says':
      doThis();
      break;
  }
}

userPick();

function tweets(){
	var y = 0;
	var client = new Twitter(keys.twitterKeys)
	var params = {screen_name: 'SirDao'};
		client.get('statuses/user_timeline', params, function(error, tweets, response){
  			if (!error) {
  				console.log('========== Twitter Info: ==========');
  				console.log(' ')

  				for (i = 0; i < 20; i++){
  					y++;
    				var tweetText = tweets[i].text;
    				var tweetDate = tweets[i].created_at;
    					console.log('----------- Tweet ' + y + ' -----------');
    				console.log(tweetText);
    				console.log(tweetDate);
    				if (i < 9){
    					console.log('-------------------------------');
    				} else {
    					console.log('--------------------------------');
    				}
    				console.log(' ');
            logResult = "  " + "Tweet " + y + ": " + tweets[i].text + "  Time:" + tweets[i].user.created_at + "  ";
            logData(logResult);
    			}
    			console.log('===================================');
  			} else {
          console.log('Error');
        }
	});
}


function songSearch(){

	var song = process.argv[3];

	if(song == null){
		song = "What's My Age Again";
	}

	spotify.search({ type: 'track', query: song }, function(err, data) {
    	if ( err ) {
        	console.log('Error occurred: ' + err);
        	return;
    	}
    	var artistName = data.tracks.items[0].artists[0].name;
    	var songName = data.tracks.items[0].name;
    	var previewLink = data.tracks.items[0].preview_url;
    	var albumName = data.tracks.items[0].album.name;
   		console.log('========== Spotify Song Info: ==========');
    	console.log(' ')
    	console.log("Artist name: " + artistName);
    	console.log("Song name: " + songName);
    	console.log("Preview Link: " + previewLink);
    	console.log("Album Name: " + albumName);
    	console.log(' ')
    	console.log('========================================');

      logResult = "***Start of Entry***" + "  " + "Artist Name: " + data.tracks.items[0].artists[0].name + "  " + "Track Name: " + data.tracks.items[0].name + "  " + "Preview URL: " + data.tracks.items[0].preview_url + "  " + "Album Name: " + data.tracks.items[0].album.name + "  " + "***End of Entry***" + "  ";
      logData(logResult);

	});
}

function movieInfo(){

	var args = process.argv.slice(3);
	var movie = args.join(" ");

	var url = 'http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&r=json&tomatoes=true'

	request(url, function(err, response, body){
		var body = JSON.parse(body);
		console.log('========== Movie Info: ==========');
		console.log(' ');
		console.log("Movie Title: " + body.Title);
		console.log("Year Released: " + body.Year);
		console.log("IMDB Rating: " + body.imbdRating);
		console.log("Country: " + body.Country);
		console.log("Language: " + body.Language);
		console.log("Plot: " + body.Plot);
		console.log("Actors: " + body.Actors);
		console.log("Rotten Tomatoes Rating: " + body.tomatoUserRating);
		console.log("Rotten Tomatoes Url: " + body.tomatoURL);
		console.log(' ');
		console.log('=================================');

    logResult = "***Start of Entry***" + "  " + "Title: " + body.Title + "  " + "Year Released: " + body.Year + "  " + "IMDB Rating: " + body.imdbRating + "  " + "Country: " + body.Country + "  " + "Language: " + body.Language + "  " + "Plot: " + body.Plot + "  " + "Actors: " + body.Actors + "  " + "Rotten Tomatoes Rating: " + body.tomatoRating + "  " + "Rotten Tomatoes Link: " + body.tomatoURL + "  " + "***End of Entry***" + "  ";
    logData(logResult);
	})
}

function doThis(){
	fs.readFile('random.txt', 'utf8', function (err,data) {
  		if (err) {
   			return console.log(err);
  		} else {
        var args = data.split(',');
        var action = args[0];
        var value = args[1];
        command = action;
        process.argv[3] = value;
        userPick();
      }
	});
}

function logData(dataToAppend) {
    fs.appendFile('log.txt', dataToAppend, (err) => {
        if (err) {
            return console.log(err)
        }
    });
};