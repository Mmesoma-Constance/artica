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

// Function to fetch artworks for a specific page
function fetchArtworks(page = 1) {
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

    // Clear the container before adding new artworks
    artContainer.innerHTML = "";

    // Iterate over the artworks data and inject HTML
    objectData.data.forEach((artwork) => {
      const imageUrl = `${objectData.config.iiif_url}/${artwork.image_id}/full/843,/0/default.jpg`;

      const img = new Image();
      img.src = imageUrl;

      // Append the artwork to the container when the image loads successfully
      img.onload = function () {
        const artworkHtml = `
          <figure class="bg-white shadow-lg rounded-md overflow-hidden ">
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

/////////////////////////////////////////////
const searchInput1 = document.getElementById("searchInput1");
const searchInput2 = document.getElementById("searchInput2");
const searchButton1 = document.getElementById("searchButton1");
const searchButton2 = document.getElementById("searchButton2");

function fetchArtworkDetailsById(artworkId) {
  return fetch(`https://api.artic.edu/api/v1/artworks/${artworkId}`)
    .then((response) => response.json())
    .then((data) => {
      const artwork = data.data;
      if (!artwork.image_id || !data.config || !data.config.iiif_url) {
        return null; // Skip if image or config is missing
      }
      const imageUrl = `${data.config.iiif_url}/${artwork.image_id}/full/843,/0/default.jpg`;
      return {
        title: artwork.title || "No title available",
        artist: artwork.artist_title || "Unknown artist",
        date: artwork.date_display || "Date not available",
        imageUrl: imageUrl,
        id: artwork.id,
      };
    })
    .catch((error) => {
      console.error("Error fetching artwork details:", error);
      return null;
    });
}

function handleSearch(inputField) {
  // Get the value from the passed input field
  const searchTerm = inputField.value.trim();

  if (searchTerm !== "") {
    fetch(`https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}`)
      .then((response) => response.json())
      .then(async (data) => {
        artContainer.innerHTML = ""; // Clear previous search results

        if (!data.data || data.data.length === 0) {
          artContainer.innerHTML = "<p>No results found.</p>";
          return;
        }

        for (const artwork of data.data) {
          const fullDetails = await fetchArtworkDetailsById(artwork.id);

          if (fullDetails && fullDetails.imageUrl) {
            const img = new Image();
            img.src = fullDetails.imageUrl;
            pageContent.style.display = "none";

            img.onload = function () {
              const artworkHtml = `
                <figure class="bg-white shadow-lg rounded-md overflow-hidden">
                  <a href="artpage.html?id=${fullDetails.id}">
                    <img
                      src="${fullDetails.imageUrl}"
                      alt="${fullDetails.title}"
                      class="cursor-pointer hover:drop-shadow-xl hover:brightness-90 w-[600px] h-[270px] object-cover"
                    />
                  </a>
                  <figcaption class="pt-2 p-4">
                    <h3 class="text-[#743051] font-bold text-lg">${fullDetails.title}</h3>
                    <p class="text-gray-500">${fullDetails.artist}, ${fullDetails.date}</p>
                  </figcaption>
                </figure>
              `;
              artContainer.innerHTML += artworkHtml;
            };

            img.onerror = function () {
              console.log(
                `Skipping artwork due to missing image: ${fullDetails.title}`
              );
            };
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  } else {
    alert("Please enter a search term.");
  }
}

// Add event listeners to both buttons
searchButton1.addEventListener("click", () => handleSearch(searchInput1));
searchButton2.addEventListener("click", () => handleSearch(searchInput2));

//

const openSearch = document.getElementById("open-search");

function searchReveal() {
  openSearch.addEventListener("click", () => {
    if (openSearch.src.endsWith("search.png")) {
      document.getElementById("sm-search").style.display = "flex";
      searchInput2.focus();
      openSearch.src = "icons/sm-search-faded.png";
    } else {
      document.getElementById("sm-search").style.display = "none";
      openSearch.src = "icons/sm-search.png";
    }
  });
}

searchReveal();

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
   
    handleSearch(searchInput2)
  }
});
