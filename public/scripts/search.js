// const searchInput = document.getElementById("searchInput");
// const searchButton = document.getElementById("searchButton");

// // Function to handle search queries
// function handleSearch() {
//   const searchTerm = searchInput.value.trim();

//   if (searchTerm !== "") {
//     // Perform search using the API with the search term
//     fetch(`https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}`)
//       .then((response) => response.json())
//       .then((data) => {
//         // Clear previous search results
//         artContainer.innerHTML = "";

//         // Check if there are any results
//         if (data.data.length === 0) {
//           artContainer.innerHTML = "<p>No results found.</p>";
//           return;
//         }

//         // Render search results
//         data.data.forEach((artwork) => {
//           const imageUrl = `${data.config.iiif_url}/${artwork.image_id}/full/843,/0/default.jpg`;

//           const artworkHtml = `
//             <figure>
//               <a href="artpage.html?id=${artwork.id}">
//                 <img
//                   src="${imageUrl}"
//                   alt="${artwork.title || "Artwork"}"
//                   class="cursor-pointer hover:drop-shadow-xl hover:brightness-90 w-full h-auto object-contain"
//                 />
//               </a>
//               <figcaption class="pt-2 p-4">
//                 <h3 class="text-[#743051] font-bold text-lg">
//                   ${artwork.title || "No title available"}
//                 </h3>
//                 <p class="text-gray-500">${
//                   artwork.artist_title || "Unknown artist"
//                 }, ${artwork.date_display || "Date not available"}</p>
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
