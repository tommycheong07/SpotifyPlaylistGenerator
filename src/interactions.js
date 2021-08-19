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
    var clientID = document.getElementById('client-id').value;
    var clientSecret = document.getElementById('client-secret').value;
    // console.log(clientID, clientSecret)
})
