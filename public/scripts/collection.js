let currentPage = 1;
const limit = 50; // Number of artworks per page
const totalArtworks = 1000; // Assuming you have around 1000 artworks
const totalPages = Math.ceil(totalArtworks / limit); // Total number of pages
const artContainer = document.querySelector(".artContainer"); // Ensure this is the correct selector
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

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
// const searchInput = document.getElementById("searchInput");
// const searchButton = document.getElementById("searchButton");

// // Function to handle search queries
// function handleSearch() {
//   const searchTerm = searchInput.value.trim();

//   if (searchTerm !== "") {
//     // Perform search using the API with the search term
//     fetch(`https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data); // Debug: Log the API response
//         artContainer.innerHTML = ""; // Clear previous search results

//         if (!data.data || data.data.length === 0) {
//           artContainer.innerHTML = "<p>No results found.</p>";
//           return;
//         }

//         // Render search results
//         data.data.forEach((artwork) => {
//           // Check if the necessary fields exist
//           const title = artwork.title || "No title available";
//           const artist = artwork.artist_title || "Unknown artist";
//           const date = artwork.date_display || "Date not available";

//           // Check if there's an image_id or thumbnail image
//           const imageId = artwork.image_id;
//           const thumbnail = artwork.thumbnail ? artwork.thumbnail.lqip : null;

//           // Construct the image URL
//           const baseUrl = data.config
//             ? data.config.iiif_url
//             : "https://www.artic.edu/iiif/2";
//           let imageUrl = imageId
//             ? `${baseUrl}/${imageId}/full/843,/0/default.jpg`
//             : thumbnail ||
//               "https://via.placeholder.com/600x270?text=No+Image+Available"; // Use thumbnail if available or a placeholder

//           const artworkHtml = `
//             <figure class="bg-white shadow-lg rounded-md overflow-hidden">
//               <a href="artpage.html?id=${artwork.id}">
//                 <img
//                   src="${imageUrl}"
//                   alt="${title}"
//                   class="cursor-pointer hover:drop-shadow-xl hover:brightness-90 w-[600px] h-[270px] object-cover"
//                 />
//               </a>
//               <figcaption class="pt-2 p-4">
//                 <h3 class="text-[#743051] font-bold text-lg">${title}</h3>
//                 <p class="text-gray-500">${artist}, ${date}</p>
//               </figcaption>
//             </figure>
//           `;
//           artContainer.innerHTML += artworkHtml;
//         });
//       })
//       .catch((error) => {
//         console.error("Error fetching search results:", error);
//       });
//   } else {
//     alert("Please enter a search term.");
//   }
// }

// // Event listener for search button
// searchButton.addEventListener("click", handleSearch);
