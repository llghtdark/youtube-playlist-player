loadPreferences();
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
       
//sounds
    const clickSound = document.getElementById('clickSound');
    const Startup = document.getElementById('Startup');
    const changeSound = document.getElementById('changeSound');
    const soundToggle = document.getElementById('soundToggle');

document.getElementById('playlistForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const playlistId = document.getElementById('playlistId').value.trim();
    loadPlaylist(playlistId); // Load the playlist with the entered ID
    if (soundToggle.checked) {
        Startup.play();

        document.getElementsByClassName("playlist-wrapper")[0].style.display = "flex";
        document.getElementById("playlistForm").style.justifyContent = "left";
    }  
});

function loadPlaylist(playlistId) {
    const apiKey = 'AIzaSyDxRQY0i22rK2kRbWcPawaItz1XKtOBGHA'; // Replace with your API key
    const playlistContainer = document.getElementById('playlist');
    const videoFrame = document.getElementById('videoFrame');
    const colorPicker = document.getElementById('colorpicker');
    const playlistTitle = document.getElementById('playlistTitle');

    document.body.style.backgroundImage = "none";

    fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        if (data.items.length > 0) {
            const title = data.items[0].snippet.title;
            playlistTitle.innerText = title; // Set the H1 tag's content to the playlist title
        } else {
            console.error('Playlist not found');
            document.body.style.backgroundImage = "url('https://cliply.co/wp-content/uploads/2021/07/402107790_STATIC_NOISE_400.gif')";
            warn("Enter a valid Playlist ID");
        }
    })
    .catch(error => {
        console.error('Error fetching playlist title:', error);
    });

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
                        videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

                        if (soundToggle.checked) {
                            clickSound.play();
                        }
                    });

                    // Automatically play the first video
                    if (index === 0 && !pageToken) { 
                        videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                    }

                    playlistContainer.appendChild(videoDiv);
                });

                // Check if there is a nextPageToken for additional items
                nextPageToken = data.nextPageToken;
                if (nextPageToken) {
                    fetchPlaylistItems(nextPageToken); // Fetch the next set of items
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
setInterval(function changeColor() { 
    let colorpicker = document.getElementById('colorpicker');
    document.body.style.backgroundColor = colorpicker.value; 
}, 3);

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