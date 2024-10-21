const artData = document.getElementById("artContainer");

// Function to create and show the skeleton loader
function showSkeletonLoader() {
  const skeletonHtml = `
    <div class="skeleton-loader">
      <div class="skeleton-img w-[600px] h-[270px] bg-gray-300"></div>
      <div class="skeleton-text mt-2 h-6 w-48 bg-gray-300"></div>
      <div class="skeleton-text mt-1 h-4 w-32 bg-gray-300"></div>
    </div>
    <div class="skeleton-loader">
      <div class="skeleton-img w-[600px] h-[270px] bg-gray-300"></div>
      <div class="skeleton-text mt-2 h-6 w-48 bg-gray-300"></div>
      <div class="skeleton-text mt-1 h-4 w-32 bg-gray-300"></div>
    </div>
    <div class="skeleton-loader">
      <div class="skeleton-img w-[600px] h-[270px] bg-gray-300"></div>
      <div class="skeleton-text mt-2 h-6 w-48 bg-gray-300"></div>
      <div class="skeleton-text mt-1 h-4 w-32 bg-gray-300"></div>
    </div>
  `;
  artData.innerHTML = skeletonHtml;
}

// Function to hide the skeleton loader
function hideSkeletonLoader() {
  artData.innerHTML = ""; // Clear the skeleton loader
}

// Function to load and display favorites on the favorites page
export function loadFavorites() {
  showSkeletonLoader(); // Show skeleton while loading

  // Retrieve favorites from localStorage
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Clear the container first
  hideSkeletonLoader(); // Hide the skeleton once data is loaded

  // Loop through favorites and generate the HTML for each artwork
  favorites.forEach((artworkDetails) => {
    const artworkHtml = `
      <figure class="bg-white shadow-lg rounded-md overflow-hidden">
        <a href="artpage.html?id=${artworkDetails.id}">
          <img
            src="${artworkDetails.imageUrl}"
            alt="${artworkDetails.title}"
            class="cursor-pointer hover:drop-shadow-xl hover:brightness-90 w-[600px] h-[270px] object-cover"
          />
        </a>
        <figcaption class="pt-2 py-4">
          <h3 class="text-[#743051] font-bold text-lg">${artworkDetails.title}</h3>
          <p class="text-gray-500">${artworkDetails.artistName}, ${artworkDetails.date}</p>
        </figcaption>
      </figure>
    `;

    // Append the generated HTML to the artContainer
    artData.innerHTML += artworkHtml;
  });

  // Handle case where no favorites exist
  if (favorites.length === 0) {
    artData.innerHTML = "<p>You have no favorite artworks yet.</p>";
  }
}

// Add to favorites function remains the same
export function addToFavorites(artworkDetails) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const isAlreadyFavorited = favorites.some(
    (fav) => fav.id === artworkDetails.id
  );

  if (!isAlreadyFavorited) {
    favorites.push(artworkDetails);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${artworkDetails.title} has been added to your favorites!`);
  } else {
    alert(`${artworkDetails.title} is already in your favorites!`);
  }
}
export function removeFromFavorites(artworkDetails) {
  // Retrieve the favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Filter out the artwork that matches the provided ID
  favorites = favorites.filter((fav) => fav.id !== artworkDetails.id);

  // Update localStorage with the new favorites array
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Optionally, give feedback to the user
  alert(`${artworkDetails.title} has been removed from your favorites!`);

  // Reload the favorites page to reflect the removal
  loadFavorites();
}

// Ensure loadFavorites is called when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();
});
