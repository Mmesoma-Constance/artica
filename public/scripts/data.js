import { addToFavorites } from "./addToFavorite.js";

const artData = document.querySelector(".artData");
const similarArts = document.querySelector(".similarArts");

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search); // Parse query parameters
  return params.get("id"); // Get the 'productId' from the URL
}

const productId = getProductIdFromUrl(); // Get the productId from the URL

// Function to show the skeleton loader before data is loaded
function showSkeletonLoader() {
  const skeletonHtml = `
    <div class="skeleton-loader flex flex-col lg:flex-row justify-between gap-10">
      <div class="skeleton-image w-[400px] h-[400px] bg-gray-300"></div>
      <div class="lg:w-[50%]">
        <div class="skeleton-title h-8 bg-gray-300 mb-4"></div>
        <div class="skeleton-text h-4 bg-gray-300 mb-2"></div>
        <div class="skeleton-text h-4 bg-gray-300 mb-2"></div>
        <div class="skeleton-text h-4 bg-gray-300 mb-2"></div>
        <div class="skeleton-text h-4 bg-gray-300 mb-2"></div>
        <div class="skeleton-button w-32 h-10 bg-gray-300 mt-5"></div>
      </div>
    </div>
    <div class="skeleton-description h-24 bg-gray-300 mt-4"></div>
  `;
  artData.innerHTML = skeletonHtml;
}

// Function to hide the skeleton loader
function hideSkeletonLoader() {
  artData.innerHTML = ""; // Clear the skeleton loader once data is fetched
}

// Async function to fetch artwork data by a given artwork ID
async function fetchArtwork(productId) {
  try {
    // Show the skeleton loader immediately
    showSkeletonLoader();

    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks/${productId}`
    );

    // Simulating network delay (optional, for testing purposes)
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay

    if (!response.ok) {
      throw new Error("Error fetching data. Retrying with another artwork...");
    }

    const objectData = await response.json();
    const matchingProduct = objectData.data;

    if (!objectData.data) {
      console.log("Data is incomplete!");
      return;
    }

    const imageId = objectData.data.image_id;
    const iiifUrl = objectData.config.iiif_url;
    const imageUrl = `${iiifUrl}/${imageId}/full/843,/0/default.jpg`;

    const artworkDetails = {
      id: objectData.data.id || "Not available",
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
      imageUrl: imageUrl,
      placeOfOrigin: objectData.data.place_of_origin,
      artMovement: objectData.data.art_movement || "Not specified",
      price: objectData.data.price || "Not for sale",
      purchaseInfo: objectData.data.purchase_info || "Contact for details",
    };

    // Hide the skeleton loader once data is fetched
    hideSkeletonLoader();

    // Insert artwork details into the page
    const html = `
      <div class="flex flex-col lg:flex-row justify-between gap-10">
        <div class="flex justify-center mx-auto lg:w-[50%]">
          <img src="${imageUrl}" class="w-[400px] object-contain h-[400px]" />
        </div>

        <div class="lg:w-[50%]">
          <h1 class="font-bold text-2xl text-[#743051] pb-4 uppercase">${artworkDetails.title}</h1>
          <h2> <span class="font-bold">ARTIST: </span> <span>  ${artworkDetails.artistName} </span></h2>
          <p> <span class="font-bold">ARTIST_ID: </span> <span>  ${artworkDetails.artistId} </span></p>
          <p> <span class="font-bold">DATE_DISPLAYED: </span> <span>  ${artworkDetails.date} </span></p>
          <p> <span class="font-bold">DATE_END: </span> <span>  ${artworkDetails.displayed} </span></p>
          <p> <span class="font-bold">PRICE: </span> <span>  ${artworkDetails.price} </span></p>
          <p> <span class="font-bold">PLACE_OF_ORIGIN: </span> <span>  ${artworkDetails.placeOfOrigin} </span></p>
          <p> <span class="font-bold">CREDIT_LINE: </span> <span>  ${artworkDetails.creditLine} </span></p>
          <p> <span class="font-bold">DIMENSIONS: </span> <span>  ${artworkDetails.dimensions} </span></p>
          <p> <span class="font-bold">COLORFULNESS: </span> <span>  ${artworkDetails.colorfulness} </span></p>
          <p> <span class="font-bold">DEPARTMENT: </span> <span>  ${artworkDetails.department} </span></p>
          <p> <span class="font-bold">ARTWORK_TYPE: </span> <span>  ${artworkDetails.artworkType} </span></p>
          <p> <span class="font-bold">MEDIUM: </span> <span>  ${artworkDetails.medium} </span></p>
          <div class="flex items-center gap-2">
            <button id="js-add-to-fav" class="bg-[#743051] rounded p-3 px-4 text-white my-5 text-sm font-semibold hover:shadow-xl" data-product-id="${artworkDetails.id}">
              ADD TO FAVORITE
            </button>
            <button class="bg-[#f5f5dc] p-2 hover:shadow-xl" id="download-button">
              <img src="icons/eye.png" class="w-7" />
            </button>
          </div>
        </div>
      </div>
      <div class="pt-4">
        <h1 class="font-bold">ART DESCRIPTION</h1>
        <p id="description-text"></p> <!-- Initially hide the description -->
        <button id="see-more-btn" class="text-[#743051] font-bold hover:font-extrabold">See More</button>
        <br/>
        <h1 class="font-bold">ARTIST DESCRIPTION</h1>
        <p> ${artworkDetails.artistDescription}</p>
      </div>
    `;

    artData.innerHTML = html;

    // Event listener for adding the artwork to favorites
    document.addEventListener("click", function (event) {
      if (event.target && event.target.id === "js-add-to-fav") {
        const productId = event.target.getAttribute("data-product-id");

        const artworkToSave = {
          id: productId,
          title: artworkDetails.title,
          artistName: artworkDetails.artistName,
          date: artworkDetails.date,
          imageUrl: artworkDetails.imageUrl,
        };
        addToFavorites(artworkToSave); // Call function to add to favorites
        document.getElementById("js-add-to-fav").innerHTML =
          "REMOVE FROM FAVORITE";
      }
    });

    // Handling description truncation logic
    const descriptionTextDiv = document.getElementById("description-text");
    const seeMoreBtn = document.getElementById("see-more-btn");
    seeMoreBtn.style.display = "none";

    const strippedText = artworkDetails.description.replace(/<[^>]*>/g, ""); // Strip HTML tags
    const words = strippedText.split(" ");
    const wordLimit = 60;

    if (words.length > wordLimit) {
      const truncatedText = words.slice(0, wordLimit).join(" ");
      descriptionTextDiv.innerHTML = truncatedText + "...";
      seeMoreBtn.style.display = "block";
    } else {
      descriptionTextDiv.innerHTML = strippedText;
      seeMoreBtn.style.display = "none";
    }

    seeMoreBtn.addEventListener("click", () => {
      descriptionTextDiv.innerHTML = strippedText;
      seeMoreBtn.style.display = "none";
    });
  } catch (error) {
    console.error("Error fetching artwork data:", error);
    hideSkeletonLoader(); // Hide skeleton loader even if an error occurs
    artData.innerHTML =
      "<p>Failed to load artwork data. Please try again later.</p>";
  }
}

// Fetch and display data based on the productId
fetchArtwork(productId);
