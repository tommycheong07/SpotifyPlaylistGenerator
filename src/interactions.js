const dislikeSong = document.querySelector('.left-button');
const likeSong = document.querySelector('.right-button');
const generatePlaylist = document.querySelector('.generate-button');
const songInfo = document.querySelector('.song-info')
const authorizeButton = document.querySelector('.authorize-button');


likeSong.addEventListener("click", function() {
    songInfo.innerHTML = 'like';
});

dislikeSong.addEventListener("click", function() {
    songInfo.innerHTML = 'dislike';
});

generatePlaylist.addEventListener("click", function() {
    alert("generate playlist button pressed")
    
});

authorizeButton.addEventListener("click", function(){
    requestAuthorization()
})


var redirect_uri = "http://localhost:8000";
var client_info_not_set = true;
var client_id = "";
var client_secret = "";
var testID = "";
let code = null;
let refresh_token = null;
let access_token = null;

const authorize = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";


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
    // xhr.setRequestHeader('Authorization', 'Basic ' + btoa(sessionStorage.getItem("client_id") + ":" + sessionStorage.getItem("client_secret")));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
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
    console.log("access_token:" + sessionStorage.getItem("access_token"))
    console.log("refresh_token:" + sessionStorage.getItem("refresh_token"))
}