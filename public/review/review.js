// Fetch the stories from the server
fetch('/storyupload')
  .then((response) => response.json())
  .then((data) => {
    let storiesContainer = document.getElementById('storiesContainer');
    storiesContainer.innerHTML = ''; // Clear loading message

    if (data.data.length === 0) {
      storiesContainer.innerHTML = '<p>No stories available yet.</p>';
      return;
    }

        // Sort the stories by timestamp in descending order
        data.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Loop through stories and display them
    data.data.forEach((storyEntry) => {
      let storyDiv = document.createElement('div');
      storyDiv.classList.add('story');
      storyDiv.innerHTML = `
        <div class="story-content">
          <p class="story-text">${storyEntry.story}</p>
          <p class="story-author"><strong>Author:</strong> ${storyEntry.author || 'Anonymous'}</p>
          <p class="story-place"><strong>Place:</strong> ${storyEntry.place || 'N/A'}</p>
        </div>
        <div class="timestamp">Submitted on: ${new Date(storyEntry.timestamp).toLocaleString()}</div>
      `;
      storiesContainer.appendChild(storyDiv);
    });
  })
  .catch((err) => {
    console.error('Error fetching stories:', err);
    document.getElementById('storiesContainer').innerHTML = '<p>Failed to load stories.</p>';
  });
