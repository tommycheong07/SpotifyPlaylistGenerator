const createPlaylistButton = document.querySelector('.create-playlist');
const skipButton = document.querySelector('.skip');
const nextButton = document.querySelector('.next');


const user = "https://api.spotify.com/v1/me"


skipButton.addEventListener("click", function() {
    window.location.href = "spotify_tinder.html"
});

createPlaylistButton.addEventListener("click", function() {
    callAPI("GET", user, null, getUserData)
});

nextButton.addEventListener("click", function() {
    window.location.href = "spotify_tinder.html"
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
        alert("Playlist Created :) Please Click Next")
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}
