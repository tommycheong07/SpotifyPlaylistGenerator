const authorizeButton = document.querySelector('.authorize-button');
const nextButton = document.querySelector('.next');


var redirect_uri = "https://thomas-cheong.com/SpotifyPlaylistGenerator/";
const authorize = "https://accounts.spotify.com/authorize"
// const TOKEN = "https://accounts.spotify.com/api/token";

let token = null;

nextButton.addEventListener("click", function() {
    if (sessionStorage.getItem("access_token") === null) {
        alert("Please Log Into Spotify")
    } else {
        window.location.href = "playlist_creation.html"
    }
})

authorizeButton.addEventListener("click", function(){
    requestAuthorization();
})

function requestAuthorization() {
    let url = authorize;
    url += "?client_id=" + '6e553f9c5d0a4b0fabceb647f896d4d8';
    url += "&response_type=token";
    url += "&redirect_uri=" + 'https://thomas-cheong.com/SpotifyPlaylistGenerator/'
    // url += "&redirect_uri=" + 'http://localhost:8000'
    url += "&show_dialog=true";
    url += "&scope=user-top-read playlist-modify-public playlist-modify-private user-read-private user-read-email"
    window.location = url;
}

function onPageLoad() {
    console.log(window.location.hash)
    if (window.location.hash.length > 0) {
        handleRedirect();
    }    
}

function handleRedirect() {
    var hash = window.location.hash.substring(1);
    var params = {}
    hash.split('&').map(hk => { 
      let temp = hk.split('='); 
        params[temp[0]] = temp[1] 
    });

    token = params.access_token;
    sessionStorage.setItem('access_token', token)
    console.log(token);
}
