const authorizeButton = document.querySelector('.authorize-button');
// const nextButton = document.querySelector('.next');


var redirect_uri = "https://thomas-cheong.com/SpotifyPlaylistGenerator/";
const authorize = "https://accounts.spotify.com/authorize";
const scopes = ["user-top-read", "playlist-modify-public", "playlist-modify-private", "user-read-private", "user-read-email"]
const delimiter = "%20";
const scope_param = scopes.join(delimiter);

authorizeButton.addEventListener("click", function(){
    requestAuthorization();
})

function requestAuthorization() {
    let url = authorize;
    url += "?client_id=" + '6e553f9c5d0a4b0fabceb647f896d4d8';
    url += "&response_type=token";
    url += "&redirect_uri=" + 'https://thomas-cheong.com/SpotifyPlaylistGenerator/playlist_creation.html'
    // url += "&redirect_uri=" + 'http://localhost:8000'
    url += "&show_dialog=true";
    url += "&scope=" + scope_param;
    window.location = url;
}

function alertAuthentication() {
    alert("Due to Spotify Developer guidelines, if you are not  added as a user of this app, you will not be able to experience it as you are not be authorized."); 
}

