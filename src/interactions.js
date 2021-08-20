const dislikeSong = document.querySelector('.left-button');
const likeSong = document.querySelector('.right-button');
const generatePlaylist = document.querySelector('.generate-button');
const songInfo = document.querySelector('.song-info')
const authorizeButton = document.querySelector('.authorize-button');

var redirect_uri = "http://localhost:8000";
const authorize = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const top_songs = "https://api.spotify.com/v1/me/top/tracks"
const artist = "https://api.spotify.com/v1/artists/"

let code = null;


likeSong.addEventListener("click", function() {
    songInfo.innerHTML = 'like';
});

dislikeSong.addEventListener("click", function() {
    songInfo.innerHTML = 'dislike';
});

generatePlaylist.addEventListener("click", function() {
    callAPI("GET", top_songs, null, getTopSongs);
    
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
        console.log(data);
        for (key in data.items) {
            // console.log(data.items[key].artists[0].id, data.items[key].artists[0].name)
            callAPI("GET", artist+data.items[key].artists[0].id, null, getArtistGenres)
        }
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }

    // console.log(genreList);
    // sort by value
    let mapSort1 = new Map([...genreList.entries()].sort((a, b) => b[1] - a[1]));
    console.log(mapSort1);

    let idx = 0;
    for (let [key, value] of mapSort1) {
        if (idx == 3) {
            break
        }
        top3Genres.push(key)
        idx += 1
    }

    // idx = 0;
    // for (genre in mapSort1) {
    //     if (idx == 3) {
    //         break;
    //     }
    //     console.log(genre)
    //     // top3Genres.push(genre);
    //     idx += 1;
    // }
    console.log(top3Genres);
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