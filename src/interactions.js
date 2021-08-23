const dislikeSong = document.querySelector('.left-button');
const likeSong = document.querySelector('.right-button');
const generatePlaylist = document.querySelector('.generate-button');
const createPlaylistButton = document.querySelector('.create-playlist');
const songInfo = document.querySelector('.song-info')
const authorizeButton = document.querySelector('.authorize-button');
const songPhoto = document.getElementById('song-photo');
const songPreview = document.getElementById('song-preview');

var redirect_uri = "http://localhost:8000";
const authorize = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const top_songs = "https://api.spotify.com/v1/me/top/tracks"
const artist = "https://api.spotify.com/v1/artists/"
const recommendations = "https://api.spotify.com/v1/recommendations"
const user = "https://api.spotify.com/v1/me"

let code = null;

likeSong.addEventListener("click", function() {
    if (recommendedSongsData.length == 0) {
        alert("No more recommended songs")
    } else {
        urlToSend = 'https://api.spotify.com/v1/playlists/'+ sessionStorage.getItem('playlist_id') +'/tracks'
        urlToSend += '?uris=' + recommendedSongsData[0][3];
        callAPI("POST", urlToSend, null, addSongToPlaylist);
        
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

createPlaylistButton.addEventListener("click", function() {

    callAPI("GET", user, null, getUserData)

});

generatePlaylist.addEventListener("click", function() {
    callAPI("GET", top_songs, null, getTopSongs);
    if(recommendedSongsData.length == 0) {
        alert("click generate song again")
    }
    songPhoto.src = recommendedSongsData[0][1];
    songPreview.src = recommendedSongsData[0][2];
    if (songPreview.src == 'null') {
        console.log(recommendedSongsData[0][2])
    } else {
        console.log(recommendedSongsData[0][2])
        document.getElementById('song-control').load();
    }
    songInfo.innerHTML = recommendedSongsData[0][0] + " by " + recommendedSongsData[0][4];
});

authorizeButton.addEventListener("click", function(){
    requestAuthorization();
})


function requestAuthorization() {
    sessionStorage.setItem("client_id", document.getElementById('client-id').value)
    sessionStorage.setItem("client_secret", document.getElementById('client-secret').value)
    let url = authorize;
    url += "?client_id=" + sessionStorage.getItem("client_id");
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri)
    url += "&show_dialog=true";
    url += "&scope=user-top-read playlist-modify-public playlist-modify-private user-read-private user-read-email"
    window.location.href = url;
}

function onPageLoad() {
    if (window.location.search.length > 0) {
        handleRedirect();
    }    
}

function handleRedirect() {
    code = getCode();
    getAccessToken(code);
    window.history.pushState("", "", redirect_uri)
}

function getCode() {
    let urlString = window.location.search;
    if (urlString.length > 0) {
        const urlParams = new URLSearchParams(urlString);
        code = urlParams.get('code');
    }
    return code;
}

function getAccessToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + sessionStorage.getItem("client_id");
    body += "&client_secret=" + sessionStorage.getItem("client_secret");
    callAuthorizationAPI(body);
}

function callAuthorizationAPI(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            sessionStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            sessionStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

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

function getUserData() {
    if (this.status == 200){
        var data = JSON.parse(this.responseText);

        sessionStorage.setItem("user_profile_id", data.id);

        playlistTitle = document.getElementById('playlist-name').value;
        playlistDescription = document.getElementById('playlist-description').value;
        checkboxPlaylist = document.getElementById('playlist-type');
        publicPlaylist = false;
        if (checkboxPlaylist.checked) {
            publicPlaylist = true;
        }

        body = {}
        body.name = playlistTitle;
        body.description = playlistDescription;
        body.public = publicPlaylist;

        callAPI("POST", "https://api.spotify.com/v1/users/"+data.id+"/playlists", JSON.stringify(body), createPlaylist)
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function createPlaylist() {
    if (this.status == 201){
        var data = JSON.parse(this.responseText)
        sessionStorage.setItem("playlist_id", data.id);
        alert("playlist created :)")
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addSongToPlaylist() {
    if (this.status == 201) {

    } else {
        console.log(this.responseText);
    }
}