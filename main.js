//sounds
    const clickSound = new Audio("sounds/vhsclick.wav");
    const Startup = new Audio("sounds/vhsstart.wav");
    const changeSound = new Audio("sounds/vhschange.wav");
    const staticNoise = new Audio("sounds/stat.mp3");

    const soundToggle = document.getElementById('soundToggle');
    const colorPicker = document.getElementById('colorpicker');

    function savePreferences() {
        localStorage.setItem('soundEnabled', soundToggle.checked);
        localStorage.setItem('backgroundColor', colorPicker.value);
    }

    function loadPreferences() {
        const soundEnabled = localStorage.getItem('soundEnabled');
        const backgroundColor = localStorage.getItem('backgroundColor');

        if (soundEnabled !== null) {
            soundToggle.checked = JSON.parse(soundEnabled);
        }
        if (backgroundColor !== null) {
            document.body.style.backgroundColor = backgroundColor;
            colorPicker.value = backgroundColor;
        }
    }

    // Save preferences when options are changed
    soundToggle.addEventListener('change', savePreferences);
    colorPicker.addEventListener('input', function() {
        document.body.style.backgroundColor = colorPicker.value;
        savePreferences();
    });
    function colorReset(){
        colorPicker.value = "#161616";
        savePreferences();
        console.log("preferences saved");
    }

    loadPreferences();

document.getElementById('playlistForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const playlistId = document.getElementById('playlistId').value.trim();
    loadPlaylist(playlistId); // Load the playlist with the entered ID

    if (soundToggle.checked) {
        staticNoise.pause();
        Startup.play();
    }  
});

function loadPlaylist(playlistId) {
    const apiKey = 'AIzaSyDxRQY0i22rK2kRbWcPawaItz1XKtOBGHA'; // Replace with your API key
    const playlistContainer = document.getElementById('playlist');
    //const videoFrame = document.getElementById('videoFrame');
    const playlistTitle = document.getElementById('playlistTitle');

    document.body.style.backgroundImage = "none";
    document.getElementsByClassName("interface")[0].style.display = "flex";
    document.getElementById("playlistForm").style.justifyContent = "left";
    
    fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        const title = data.items?.[0]?.snippet?.title;
        if (title) {
        playlistTitle.innerText = title;
        } else {
        console.error('Playlist not found');
        document.body.style.backgroundImage = "url('staticnoise.gif')";
        staticNoise.play();
        alert("Enter a valid Playlist ID");
        }
    })
    .catch(err => console.error('Error fetching playlist title:', err));

    let nextPageToken = '';
    // Clear the existing playlist
    playlistContainer.innerHTML = '';

    function fetchPlaylistItems(pageToken = '') {
        fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${pageToken}&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                data.items.forEach((item, index) => {
                    const videoId = item.snippet.resourceId.videoId;
                    const title = item.snippet.title;
                    const videoDiv = document.createElement('div');
                    videoDiv.innerText = title;

                    videoDiv.addEventListener('click', () => {
                        player.loadVideoById(videoId);
                        player.playVideo();

                        if (soundToggle.checked) {
                            clickSound.play();
                        }
                    });

                    // Automatically play the first video
                    if (index === 0 && !pageToken) { 
                        player.loadVideoById(videoId);
                        player.playVideo();
                    }

                    playlistContainer.appendChild(videoDiv);
                });

                // Check if there is a nextPageToken for additional items
                nextPageToken = data.nextPageToken;
                if (nextPageToken) {
                    fetchPlaylistItems(nextPageToken);
                }
            })
            .catch(error => {
                console.error('Error fetching playlist:', error);
            });
    }

    // Initial fetch to load playlist items
    fetchPlaylistItems();
}

// ColorPicker functionality
colorPicker.addEventListener('input', function() {
    document.body.style.backgroundColor = colorPicker.value;
    savePreferences();
});

//sidepanel
function togglePanel() {
    var panel = document.getElementById("sidePanel");
    if (panel.style.right === "0px") {
      panel.style.right = "-250px";
    } else {
      panel.style.right = "0px";
    }
  }
  
  function toggleAutoplay() {
    var autoplay = document.getElementById("autoplayToggle").checked;
  }
  
  function toggleFilter() {
    var filter = document.getElementById("filterUnavailable").checked;
  }