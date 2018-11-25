
//---------set up environment-----------
const env = require("dotenv").config()
const keys = require("./keys.js")
const axios = require("axios")
const moment = require("moment")
const Spotify = require("node-spotify-api")
const fs = require("fs")


//============== command 1 ====================

function concert_this(artistName) {

    //----------retrive the data from bandintown API---------------

    var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp&date=all"



    return axios.get(queryURL).then(
        function (response) {
            var dataCollection = [];
            // console.log(response)
            for (var j = 0; j < response.data.length; j++) {
                var dataName = response.data[j].venue.name;
                var dataLocation = response.data[j].venue.city;
                var datetime = moment(moment(response.data[j].datetime).format("YYYY-MM-DDThh:mm:ss")).format("MM/DD/YYYY")

                var data = {
                    venue: dataName,
                    location: dataLocation,
                    dataTime: datetime
                }

                // console.log(data)
                dataCollection.push(data)

            }

            return JSON.stringify(dataCollection)
        }
    )

}


//==================== command 2 ======================

function spotify_this_song(song) {

    var spotify = new Spotify(keys.spotify);
    console.log(spotify)

    var songCollection = [];

    //----------retrive the data from spotify API--------------
    return spotify.search({ type: 'track', query: song }).then(function (data) {

        // if (err) {
        //     return console.log('Error occurred: ' + err);
        // }

        for (var j = 0; j < data.tracks.items.length; j++) {
            var songdata = data.tracks.items[j];
            var songInfo = {
                artist: songdata.album.artists[0].name,
                preview_link: songdata.preview_url,
                album_name: songdata.album.name,
                release_date:
                    songdata.album.release_date
            }

            songCollection.push(songInfo)

        }

        console.log(JSON.stringify(songCollection))

        return JSON.stringify(songCollection)
        // if (data === undefined || data === null) {
        //     spotify.search({ type: 'track', query: "The Sign" }, function (data) {
        //         for (var k = 0; k < data.tracks.items.length; k++) {
        //             var songInfo = data.tracks.items[k];
        //             var collection = {
        //                 artist: songInfo.album.artists[0].name,
        //                 preview_link: songInfo.preview_url,
        //                 album_name: songInfo.album.name,
        //                 release_date:
        //                     songInfo.album.release_date
        //             }
        //             if (collection.artist === " Ace of Base") {
        //                 console.log(collection);
        //             }
        //         }
        //     })

        // }

    });


}



//--------------- command 3 -----------------------

function movie_this(movieName) {

    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + movieName

    console.log(queryUrl)


    // run a request with axios to the OMDB API with the movie specified
    return axios.get(queryUrl).then(
        function (response) {

            var movieData = {
                title: response.data.Title,
                year: response.data.Year,
                imdb_rating: response.data.imdbRating,
                rotten_tomato: response.data.Ratings[1].Value,
                country: response.data.Country,
                language: response.data.Language,
                plot: response.data.Plot,
                actor: response.data.Actors
            }
            
            console.log(movieData)
            return JSON.stringify(movieData);
        }
    );


}

//---------------- action -------------------------
const command = process.argv[2]
const content = process.argv[3] + ""

if (command === "concert-this") {
    concert_this(content)
} else if (command === "spotify-this-song") {
    spotify_this_song(content)
} else if (command === "movie-this") {
    movie_this(content)
}



//----------------- command 4 -------------------------
else if (command === "do-what-it-says") {

    fs.readFile("rdm.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err)
        }

        var array = data.split(",")

        var comd = array[0];
        var input = array[1].trim();

        console.log(comd);
        console.log(input);


        if (comd === "concert-this") {
            concert_this(input).then(function (dataString) {
                fs.appendFile("rdm.txt", "\n\n\n" + dataString, function (err) {

                    if (err) {
                        return console.log(err);
                    }
                    console.log("rdm.txt was updated!");
                })
            })


        } else if (comd === "spotify-this-song") {
            spotify_this_song(input).then(function (songInfo) {

                fs.appendFile("rdm.txt", "\n\n" + songInfo, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("rdm.txt was updated!");
                })

            })



        } else if (comd === "movie-this") {
             movie_this(input).then(function(movieInfo){
                fs.appendFile("rdm.txt", "\n\n\n"+movieInfo , function(){
                    if (err) {
                        return console.log(err);
                      }
                      console.log("rdm.txt was updated!");
                })
             })


        }

    })
}
