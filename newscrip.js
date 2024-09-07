document.addEventListener("DOMContentLoaded", function() {
    const playlistId = 'PLnfgNwnDmwxiJr8xZTuLyEo3AJrUVR2ls'; // Replace with the actual playlist ID
    const apiKey = 'AIzaSyDxRQY0i22rK2kRbWcPawaItz1XKtOBGHA'; // Replace with your API key
    const playlistContainer = document.getElementById('playlist');
    const videoFrame = document.getElementById('videoFrame');
    let nextPageToken = '';

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
});
