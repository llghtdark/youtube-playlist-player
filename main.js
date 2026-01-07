//sounds
    const clickSound = new Audio("sounds/vhsclick.wav");
    const Startup = new Audio("sounds/vhsstart.wav");
    const changeSound = new Audio("sounds/vhschange.wav");
    const staticNoise = new Audio("sounds/stat.mp3");
    const pauseSound = new Audio("sounds/vhsstop.wav");
    const playSound = new Audio("sounds/vhsplay.wav")
//end of sounds
    
    const soundToggle = document.getElementById('soundToggle');
    const colorPicker = document.getElementById('colorpicker');

    const apiKey = 'AIzaSyDxRQY0i22rK2kRbWcPawaItz1XKtOBGHA';
    const playlistTitle = document.getElementById('playlistTitle');
    const playlistContainer = document.getElementById('playlist');

    const playlistVideos = [];

    function savePreferences() {
        localStorage.setItem('soundEnabled', soundToggle.checked);
        localStorage.setItem('backgroundColor', colorPicker.value);
    }

    function loadPreferences() {
        const soundEnabled = localStorage.getItem('soundEnabled');
        const backgroundColor = localStorage.getItem('backgroundColor');

        if (soundEnabled !== null) {
            soundToggle.checked = JSON.parse(soundEnabled); // why only works with parse??
        }
        if (backgroundColor !== null) {
            document.body.style.backgroundColor = backgroundColor;
            colorPicker.value = backgroundColor;
        }
    }

    //This is weird change that later
    soundToggle.addEventListener('change', savePreferences);
    loadPreferences();

document.getElementById('playlistForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const playlistId = document.getElementById('playlistId').value.trim();

    loadPlaylist(playlistId);

    if (soundToggle.checked) {
        staticNoise.pause();
        Startup.play();
    }  
});

async function loadPlaylist(playlistId) {
    document.body.style.backgroundImage = "none"; //this is to take off the white noise background
    document.querySelector(".interface").style.display = "flex";
    document.getElementById("playlistForm").style.justifyContent = "left";
    
    clearPlaylist();

    getTitle(playlistId);
    await fetchPlaylistItems(playlistId);
    renderPlaylist();
}

async function getTitle(playlistId){
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`);
        const data = await response.json();
    
        const title = data.items?.[0]?.snippet?.title;
        if (title) {
            playlistTitle.innerText = title;
        } else {
            console.error("Error fetching playlist title");
            document.body.style.backgroundImage = "url('staticnoise.gif')";
            staticNoise.play();
            alert("Enter a valid Playlist ID");
        }
    } catch (e) {
        console.error("Playlist not found", e);
    }
}

async function fetchPlaylistItems(playlistId, pageToken = "") {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${pageToken}&key=${apiKey}`);
        const data = await response.json();

        data.items.forEach(item => {
            const videoId = item.snippet.resourceId.videoId;
            const title = item.snippet.title;
            playlistVideos.push({ videoId, title });
        });

        if (data.nextPageToken) {
            await fetchPlaylistItems(playlistId, data.nextPageToken);
        }
    } catch (error) {
        console.error("Erro ao buscar playlist:", error);
        alert("brotha something went wrong somehow");
    }
}

function renderPlaylist() {
   clearPlaylist();

    playlistVideos.forEach((video, index) => {
        const videoDiv = document.createElement('div');
        videoDiv.innerText = video.title;

        videoDiv.addEventListener('click', () => {
            player.loadVideoById(video.videoId);
            player.playVideo();

            if (soundToggle.checked) {
                clickSound.play();
            }
        });

        if (index === 0) {
            player.loadVideoById(video.videoId);
            player.playVideo();
        }

        playlistContainer.appendChild(videoDiv);
    });
}

// ColorPicker functionality
colorPicker.addEventListener('input', function() {
    document.body.style.backgroundColor = colorPicker.value;
    savePreferences();
});

function clearPlaylist(){
    playlistContainer.innerHTML = '';
}

function colorReset(){
        colorPicker.value = "#161616";
        document.body.style.backgroundColor = colorPicker.value;
        savePreferences();
    }

//sidepanel
function togglePanel() {
    let panel = document.querySelector(".side-panel");
    if (panel.style.right === "0px") {
      panel.style.right = "-250px";
    } else {
      panel.style.right = "0px";
    }
  }
  
  //not used yet
  let autoplay = false;
  function toggleAutoplay() {
    autoplay = document.getElementById("autoplayToggle").checked;
  }
  
  function toggleFilter() {
    let filter = document.getElementById("filterUnavailable").checked;
  }