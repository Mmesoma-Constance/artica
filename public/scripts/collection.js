let currentPage = 1;
const limit = 50; // Number of artworks per page
const totalArtworks = 1000; // Assuming you have around 1000 artworks
const totalPages = Math.ceil(totalArtworks / limit); // Total number of pages
const artContainer = document.querySelector(".artContainer"); // Ensure this is the correct selector
const pageContent = document.querySelector(".pagination-controls");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

pageContent.style.display = "flex";

// Function to generate skeleton loaders
function generateSkeletonLoader() {
  artContainer.innerHTML = ""; // Clear the container before adding skeletons
  for (let i = 0; i < limit; i++) {
    const skeleton = `
      <figure class="bg-gray-200 shadow-lg rounded-md overflow-hidden animate-pulse">
        <div class="w-[600px] h-[270px] bg-gray-300"></div>
        <figcaption class="p-4">
          <div class="h-6 bg-gray-300 mb-2 rounded-md w-2/3"></div>
          <div class="h-4 bg-gray-300 rounded-md w-1/3"></div>
        </figcaption>
      </figure>
    `;
    artContainer.innerHTML += skeleton;
  }
}

// Function to fetch artworks for a specific page
function fetchArtworks(page = 1) {
  // Display skeleton loader while data is being fetched
  generateSkeletonLoader();

  const request = new XMLHttpRequest();
  request.open(
    "GET",
    `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`
  );
  request.send();

  request.addEventListener("load", function () {
    const objectData = JSON.parse(this.responseText);

    if (!objectData.data) {
      alert("Failed to fetch data");
      return;
    }

    // Clear the skeletons after the real data is fetched
    artContainer.innerHTML = "";

    // Iterate over the artworks data and inject HTML
    objectData.data.forEach((artwork) => {
      const imageUrl = `${objectData.config.iiif_url}/${artwork.image_id}/full/843,/0/default.jpg`;

      const img = new Image();
      img.src = imageUrl;

      // Append the artwork to the container when the image loads successfully
      img.onload = function () {
        const artworkHtml = `
          <figure class="bg-white shadow-lg rounded-md overflow-hidden">
            <a href="artpage.html?id=${artwork.id}">
              <img
                src="${imageUrl}"
                alt="${artwork.title || "Artwork"}"
                class="cursor-pointer hover:drop-shadow-xl hover:brightness-90 w-[600px] h-[270px] object-cover"
              />
            </a>
            <figcaption class="pt-2 p-4">
              <h3 class="text-[#743051] font-bold text-lg">
                ${artwork.title || "No title available"}
              </h3>
              <p class="text-gray-500">${
                artwork.artist_title || "Unknown artist"
              }, ${artwork.date_display || "Date not available"}</p>
            </figcaption>
          </figure>
        `;
        artContainer.innerHTML += artworkHtml;
      };

      // Skip invalid images
      img.onerror = function () {
        console.log(`Skipping invalid image: ${artwork.title}`);
      };
    });

    // Update pagination controls (disable/enable buttons)
    updatePaginationControls();
  });
}

// Function to handle page changes
function changePage(newPage) {
  if (newPage > 0 && newPage <= totalPages) {
    currentPage = newPage;
    fetchArtworks(currentPage);
    pageInfo.textContent = `Page ${currentPage}`;
  }
}

// Function to update pagination buttons' states
function updatePaginationControls() {
  // Disable "Previous" button on the first page
  prevPageButton.disabled = currentPage === 1;

  // Disable "Next" button on the last page
  nextPageButton.disabled = currentPage === totalPages;
}

// Event listeners for the pagination buttons
prevPageButton.addEventListener("click", () => changePage(currentPage - 1));
nextPageButton.addEventListener("click", () => changePage(currentPage + 1));

// Initial fetch
fetchArtworks(currentPage);
