const artContainer = document.querySelector(".artContainer");

// Function to fetch all artworks data
function fetchAllArtworks() {
  const request = new XMLHttpRequest();
  request.open("GET", "https://api.artic.edu/api/v1/artworks?page=1&limit=50"); // Adjust the page and limit
  request.send();

  request.addEventListener("load", function () {
    const objectData = JSON.parse(this.responseText);

    if (!objectData.data) {
      alert("Failed to fetch data");
      return;
    }

    // Iterate over the artworks data
    objectData.data.forEach((artwork) => {
      const imageUrl = `${objectData.config.iiif_url}/${artwork.image_id}/full/843,/0/default.jpg`;

      // Create an image element to test if the image URL is valid
      const img = new Image();
      img.src = imageUrl;

      // Wait for the image to fully load
      img.onload = function () {
        // If image loads successfully, append the artwork to the DOM
        const artworkHtml = `
          <figure>
            <a href="artpage.html?id=${artwork.id}">
              <img
                src="${imageUrl}"
                alt="${artwork.title || "Artwork"}"
                class="cursor-pointer hover:drop-shadow-xl hover:brightness-90 w-[600px] h-[250px] object-cover"
              />
            </a>
            <figcaption class="pt-2">
              <h3 class="text-[#743051] font-bold">
                ${artwork.title || "No title available"}
              </h3>
              <p>${artwork.artist_title || "Unknown artist"}, ${
          artwork.date_display || "Date not available"
        }</p>
            </figcaption>
          </figure>
        `;

        // Append the generated HTML to the container
        artContainer.innerHTML += artworkHtml;
      };

      // Handle images that fail to load (404/403)
      img.onerror = function () {
        console.log(`Skipping invalid image: ${artwork.title}`);
      };
    });
  });
}

// Call the function to fetch and display the artworks when the page loads
fetchAllArtworks();
