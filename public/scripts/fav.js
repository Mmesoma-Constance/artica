function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search); // Parse query parameters
  return params.get("id"); // Get the 'productId' from the URL
}

const productId = getProductIdFromUrl(); // Get the productId from the URL

const artData = document.querySelector(".artContainer");

function fetchData(productId) {
  const request = new XMLHttpRequest();
  request.open("GET", `https://api.artic.edu/api/v1/artworks/${productId}`);
  request.send();

  request.addEventListener("load", function () {
    if (this.status === 404 || this.status === 403 || !this.responseText) {
      console.log("Data is incomplete! Trying another random ID...");
      // fetchRandomArtwork(); // Retry with another random ID
      return;
    }

    const objectData = JSON.parse(this.responseText);
    const matchingProduct = objectData.data;

    if (!objectData.data) {
      console.log("Data is incomplete!");
      return;
    }

    const imageId = objectData.data.image_id;
    const iiifUrl = objectData.config.iiif_url;

    const imageUrl = `${iiifUrl}/${imageId}/full/843,/0/default.jpg`;
    console.log(objectData);

    const artworkDetails = {
      title: objectData.data.title || "Not available",
      artistName: objectData.data.artist_title || "Not available",
      artistId: objectData.data.artist_id || "Not available",
      artworkType: objectData.data.artwork_type_title || "Not available",
      date: objectData.data.date_display || "Not available",
      displayed: objectData.data.date_end || "Not available",
      medium: objectData.data.medium_display || "Not available",
      dimensions: objectData.data.dimensions || "Not available",
      department: objectData.data.department_title || "Not available",
      colorfulness: objectData.data.colorfulness || "Not available",
      description: objectData.data.description || "No description available",
      artistDescription:
        objectData.data.short_description || "No description available",
      creditLine: objectData.data.credit_line || "Not available",
      imageId: objectData.data.image_id || "Not available",
      imageUrl: `${objectData.config.iiif_url}/${objectData.data.image_id}/full/843,/0/default.jpg`,
      placeOfOrigin: objectData.data.place_of_origin,
      artMovement: objectData.data.art_movement || "Not specified",
      relatedArtists: objectData.data.related_artists || [],
      price: objectData.data.price || "Not for sale",
      purchaseInfo: objectData.data.purchase_info || "Contact for details",
    };

    // Log the extracted data
    console.log(artworkDetails);

    // Find the matching product in the products array using the productId

    if (matchingProduct) {
      const html = `
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

      artData.innerHTML = html; // Insert artwork details into the page
    }
  });
}

fetchData(productId);
