const createPlaylistButton = document.querySelector('.create-playlist');
const skipButton = document.querySelector('.skip');
const nextButton = document.querySelector('.next');


const user = "https://api.spotify.com/v1/me"
const top_songs = "https://api.spotify.com/v1/me/top/tracks"

function onPageLoad() {
    var hash = window.location.hash.substring(1);
    var params = {}
    hash.split('&').map(hk => { 
      let temp = hk.split('='); 
        params[temp[0]] = temp[1] 
    });

    let token = params.access_token;
    sessionStorage.setItem('access_token', token)
};



skipButton.addEventListener("click", function() {
    window.location.href = "spotify_shuffle.html"
});

createPlaylistButton.addEventListener("click", function() {
    callAPI("GET", user, null, getUserData)
});

nextButton.addEventListener("click", function() {
    window.location.href = "spotify_shuffle.html"
})

function callAPI(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access_token"))
    xhr.send(body);
    xhr.onload = callback;
}

function getUserData() {
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log("HI")
        console.log(data)

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
        console.log(this.responseText, this.status, this.response);
        alert(this.responseText);
    }
}

function createPlaylist() {
    if (this.status == 201){
        var data = JSON.parse(this.responseText)
        sessionStorage.setItem("playlist_id", data.id);
        alert("Playlist Created :) Please Click Next")
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}
