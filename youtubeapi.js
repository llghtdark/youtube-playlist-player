
var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('videoFrame', {
        height: '315',
        width: '560',
        videoId: '',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars:{
            rel: 0
        }

    });
}

function onPlayerReady(event) {
    console.log('Player pronto!');
    // Exemplo: Auto-play
    // event.target.playVideo();
}

function onPlayerStateChange(event) {
    console.log('Estado do player:', event.data);
     if (event.data === YT.PlayerState.ENDED && autoplay) {
        playNextVideo();
    }


    if (event.data === YT.PlayerState.PAUSED && soundToggle.checked && player.getCurrentTime() > 1) {
        pauseSound.play();
    }else if ((event.data === YT.PlayerState.BUFFERING || event.data === YT.PlayerState.UNSTARTED) && player.getCurrentTime() > 1) {
        playSound.play();
    }

}

function playNextVideo() {
    loadVideoById()
}