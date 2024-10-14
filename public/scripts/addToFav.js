export function addToFavorites(productId, artworkDetails) {
  // Get the existing favorites from local storage, or initialize an empty array if none exist
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if the artwork is already in the favorites list
  const alreadyInFavorites = favorites.some(
    (artwork) => artwork.id === productId
  );

  if (!alreadyInFavorites) {
    // Add the new artwork to the favorites list
    favorites.push(artworkDetails);

    // Save the updated favorites list back to local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));

    alert("Artwork added to favorites!");
  } else {
    alert("This artwork is already in your favorites.");
  }
}
