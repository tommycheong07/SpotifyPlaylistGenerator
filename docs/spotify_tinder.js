const dislikeSong = document.querySelector('.left-button');
const likeSong = document.querySelector('.right-button');
const generatePlaylist = document.querySelector('.generate-button');
const songInfo = document.querySelector('.song-info')
const songPhoto = document.getElementById('song-photo');
const songPreview = document.getElementById('song-preview');

const top_songs = "https://api.spotify.com/v1/me/top/tracks"
const artist = "https://api.spotify.com/v1/artists/"
const recommendations = "https://api.spotify.com/v1/recommendations"

let firstLike = true;


likeSong.addEventListener("click", function() {
    // console.log(recommendedSongsData)
    if (firstLike) {
        recommendedSongsData.splice(0, 1);
        firstLike = false;
        songPhoto.src = recommendedSongsData[0][1];
        songPreview.src = recommendedSongsData[0][2];
        if (songPreview.src == 'null') {
            console.log(recommendedSongsData[0][2])
        } else {
            console.log(recommendedSongsData[0][2])
            document.getElementById('song-control').load();
        }
        songInfo.innerHTML = recommendedSongsData[0][0] + " by " + recommendedSongsData[0][4];
    } else {
        if (recommendedSongsData.length == 0) {
            alert("No more recommended songs")
        } else {
            if (sessionStorage.getItem('playlist_id') !== null) {
                urlToSend = 'https://api.spotify.com/v1/playlists/'+ sessionStorage.getItem('playlist_id') +'/tracks'
                urlToSend += '?uris=' + recommendedSongsData[0][3];
                callAPI("POST", urlToSend, null, addSongToPlaylist);
                console.log(recommendedSongsData[0][0] + " by " + recommendedSongsData[0][4]);
            }
            recommendedSongsData.splice(0, 1);
            songPhoto.src = recommendedSongsData[0][1];
            songPreview.src = recommendedSongsData[0][2];
            if (songPreview.src == 'null') {
                console.log(recommendedSongsData[0][2])
            } else {
                console.log(recommendedSongsData[0][2])
                document.getElementById('song-control').load();
            }
            songInfo.innerHTML = recommendedSongsData[0][0] + " by " + recommendedSongsData[0][4];
        }
    }
});

dislikeSong.addEventListener("click", function() {
    if (recommendedSongsData.length == 0) {
        alert("No more recommended songs")
    } else {
        recommendedSongsData.splice(0, 1);
        songPhoto.src = recommendedSongsData[0][1];
        songPreview.src = recommendedSongsData[0][2];
        if (songPreview.src == 'null') {
            console.log(recommendedSongsData[0][2])
        } else {
            console.log(recommendedSongsData[0][2])
            document.getElementById('song-control').load();
        }
        songInfo.innerHTML = recommendedSongsData[0][0] + " by " + recommendedSongsData[0][4];
    }
});

generatePlaylist.addEventListener("click", function() {
    callAPI("GET", top_songs, null, getTopSongs);
    if(recommendedSongsData.length == 0) {
        alert("click generate song again")
    } else {
        recommendedSongsData.splice(0, 1);
        alert("Songs Are Generated, Press 'Like' To Start!")
    }
});

function callAPI(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access_token"))
    xhr.send(body);
    xhr.onload = callback;
}

let genreList = new Map();
let top3Genres = [];

function getTopSongs() {
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        // console.log(data);
        for (key in data.items) {
            // console.log(data.items[key].artists[0].id, data.items[key].artists[0].name)
            callAPI("GET", artist+data.items[key].artists[0].id, null, getArtistGenres)
        }
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }

    // sort by value and find top 3 genres
    let mapSort1 = new Map([...genreList.entries()].sort((a, b) => b[1] - a[1]));
    // console.log(mapSort1);

    top3Genres = [];
    let idx = 0;
    for (let [key, value] of mapSort1) {
        if (idx == 3) {
            break
        }
        top3Genres.push(key)
        idx += 1
    }
    // console.log(top3Genres);
    getRecommendedSongs();
}

function getArtistGenres() {
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        for (key in data.genres) {
            let keyVal = data.genres[key];
            if(genreList.has(keyVal)) {
                genreList.set(keyVal, genreList.get(keyVal) + 1);
             } else {
                genreList.set(keyVal, 1);
             }
        }
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

let recommendedSongsData = []

function getRecommendedSongs() {
    callAPI("GET", top_songs, null, prepareRecSeeds);
}

function prepareRecSeeds() {
    if (this.status == 200){
        let genresToSend = top3Genres.join();
        var data = JSON.parse(this.responseText);
        // console.log(data);
        recommendedSongsData = [];
        for (key in data.items) {
            urlToSend = recommendations;
            urlToSend += "?limit=3&market=US"
            urlToSend += "&seed_artists=" + data.items[key].artists[0].id;
            urlToSend += "&seed_genres=" + genresToSend;
            urlToSend += "&seed_tracks=" + data.items[key].id;
            callAPI("GET", urlToSend, null, getRecommendations);
        }
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }

    // console.log(recommendedSongsData)
}

function getRecommendations() {

    if (this.status == 200) {
        let data = JSON.parse(this.responseText);

        for (key in data.tracks) {
            // console.log(data.tracks[key])
            albumn_img = data.tracks[key]['album']['images'][0].url;
            preview_url = data.tracks[key].preview_url;
            title = data.tracks[key].name;
            song_uri = data.tracks[key].uri;
            song_artist = data.tracks[key]['artists'][0].name

            recommendedSongsData.push([title, albumn_img, preview_url, song_uri, song_artist]);
        }
    } else {
        console.log(this.responseText)
    }
}

function addSongToPlaylist() {
    if (this.status == 201) {

    } else {
        console.log(this.responseText);
    }
}