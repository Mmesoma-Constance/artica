import { addToFavorites } from "./addToFav.js";

const artData = document.querySelector(".artData");
const similarArts = document.querySelector(".similarArts");

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search); // Parse query parameters
  return params.get("id"); // Get the 'productId' from the URL
}

const productId = getProductIdFromUrl(); // Get the productId from the URL

// Function to fetch artwork data by a given artwork ID
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
          <a href="fav.html?id=${productId}">  <button id="js-add-to-fav" class="bg-[#743051] rounded p-3 px-4 text-white my-5 text-sm font-semibold hover:shadow-xl"  data-product-id="${artworkDetails.id}">
              ADD TO FAVORITE
            </button></a>
            <button class="bg-[#f5f5dc] p-2 hover:shadow-xl">
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

      artData.innerHTML = html; // Insert artwork details into the page

      const addToFavButton = document.getElementById("js-add-to-fav");
      addToFavButton.addEventListener("click", () => {
        const productId = addToFavButton.dataset.productId;
        addToFavorites(productId, artworkDetails);
      });

      function stripHTML(html) {
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return (
          tempDiv.textContent || tempDiv.innerText || "No description available"
        );
      }

      const descriptionTextLimit = artworkDetails.description; // Original HTML content
      console.log(descriptionTextLimit.length);

      const wordLimit = 60; // Number of words to display in the truncated version

      const descriptionTextDiv = document.getElementById("description-text");
      const seeMoreBtn = document.getElementById("see-more-btn");
      seeMoreBtn.style.display = "none";

      descriptionTextDiv.innerHTML = "No description available";

      // Strip HTML tags to get plain text for truncation
      const plainText = stripHTML(descriptionTextLimit);
      const words = plainText.split(" ");

      function displayText(isFullText = false) {
        if (!isFullText && words.length > wordLimit) {
          // Show truncated text
          const truncatedText = words.slice(0, wordLimit).join(" ") + "...";
          descriptionTextDiv.innerHTML = `<p>${truncatedText}</p>`;
          seeMoreBtn.style.display = "block";
          seeMoreBtn.innerText = "See More"; // Show the 'See More' button
        } else {
          // Show full text (HTML content)
          descriptionTextDiv.innerHTML = descriptionTextLimit;

          seeMoreBtn.innerText = "See Less"; // Toggle to 'See Less' button
        }
      }

      // Initial display with truncated text
      displayText();

      // Toggle between full and truncated text when the button is clicked
      seeMoreBtn.addEventListener("click", function () {
        if (seeMoreBtn.innerText === "See More") {
          // Show full text
          displayText(true);
        } else {
          // Revert back to truncated text
          displayText(false);
        }
      });
    }

    // Call another API to fetch other artworks by the same artist using artist_id
    const artistArtworksRequest = new XMLHttpRequest();
    artistArtworksRequest.open(
      "GET",
      `https://api.artic.edu/api/v1/artworks?artist_ids=${artworkDetails.artistId}`
    );
    artistArtworksRequest.send();

    artistArtworksRequest.addEventListener("load", function () {
      const artistArtworksData = JSON.parse(this.responseText);
      const artworksByArtist = artistArtworksData.data;

      if (artworksByArtist.length > 1) {
        // Select the container where the slider should be inserted
        const similarArtsContainer = document.querySelector(".similarArts");

        // Insert the slider container HTML into the similarArts div
        const artHTML = `
      <div class="related-artworks-slider relative overflow-hidden">
        <h1 class="font-bold text-xl text-[#743051] pb-4">RELATED ARTWORKS</h1>

        <div
          class="flex transition-transform duration-300 ease-in-out space-x-4"
          id="slider"
        >
          <!-- Artworks will be dynamically inserted here -->
        </div>

        <!-- Slider navigation buttons -->
        <button
          id="prevBtn"
          class="absolute top-1/2 left-0 bg-[#743051] text-white p-2 transform -translate-y-1/2 hover:bg-[#a0506d]"
        >
          Prev
        </button>
        <button
          id="nextBtn"
          class="absolute top-1/2 right-0 bg-[#743051] text-white p-2 transform -translate-y-1/2 hover:bg-[#a0506d]"
        >
          Next
        </button>
      </div>
    `;

        similarArtsContainer.innerHTML = artHTML; // Insert the slider HTML into the div

        const slider = document.getElementById("slider");

        // Loop through each artwork and display it in a flex item
        artworksByArtist.forEach((artwork) => {
          const imageId = artwork.image_id;
          const iiifUrl = artistArtworksData.config.iiif_url;

          // Construct the image URL for each artwork
          const imageUrl = `${iiifUrl}/${imageId}/full/843,/0/default.jpg`;

          // Insert the artwork's details into the HTML
          const artItemHTML = `
        <figure class="w-full sm:w-[30%] flex-shrink-0">
          <a href="artpage.html">
            <img src="${imageUrl}" class="h-[250px] object-cover w-full" />
          </a>
          <figcaption class="pt-2">
            <h3 class="text-[#743051] font-bold">${artwork.title}</h3>
            <p>${artwork.artist_display}, ${artwork.date_display}</p>
          </figcaption>
        </figure>
      `;

          // Append the generated HTML to the slider container
          slider.insertAdjacentHTML("beforeend", artItemHTML);
        });

        // Slider JavaScript to handle previous and next buttons
        let currentPosition = 0;
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");

        // Get slide width
        function slideWidth() {
          return slider.children[0].offsetWidth;
        }

        // Get the total number of slides
        const totalSlides = slider.children.length;

        // Get the number of visible slides in the slider's container
        function visibleSlides() {
          const sliderWidth = slider.offsetWidth;
          return Math.floor(sliderWidth / slideWidth());
        }

        // Previous button click event
        prevBtn.addEventListener("click", () => {
          currentPosition = Math.max(currentPosition - slideWidth(), 0); // Don't go left past the first image
          slider.style.transform = `translateX(-${currentPosition}px)`;
        });

        // Next button click event
        nextBtn.addEventListener("click", () => {
          const maxPosition = (totalSlides - visibleSlides()) * slideWidth();

          // Ensure we don't overshoot the last image, ensuring it's fully visible
          currentPosition = Math.min(
            currentPosition + slideWidth(),
            maxPosition + slideWidth() // Add one extra slide width to ensure the last image isn't cut off
          );
          slider.style.transform = `translateX(-${currentPosition}px)`;
        });

        // Automatically adjust the slider on window resize
        window.addEventListener("resize", () => {
          slider.style.transform = `translateX(-${currentPosition}px)`;
        });
      } else {
        console.log("This artist does not have any other artworks.");
      }
    });
  });
}

fetchData(productId);

// // Function to fetch a random artwork
// function fetchRandomArtwork() {
//   const randomId = Math.floor(Math.random() * 10000); // Random number between 0 and 9999
//   fetchData(randomId); // Try fetching the random artwork
// }

// // Fetch the first random artwork when the page loads
// fetchRandomArtwork();

document.getElementById("favorites").addEventListener("click", () => {
  location.href = `fav.html?productId=${productId}`;
});

// Function to fetch and display all artworks by a specific artist (e.g., Vincent van Gogh with artist_id 40482)
//
