const artData = document.querySelector(".artData");
const similarArts = document.querySelector(".similarArts");

// Function to fetch artwork data by a given artwork ID
function fetchData(artworkId) {
  const request = new XMLHttpRequest();
  request.open("GET", `https://api.artic.edu/api/v1/artworks/${artworkId}`);
  request.send();

  request.addEventListener("load", function () {
    if (this.status === 404 || this.status === 403 || !this.responseText) {
      console.log("Data is incomplete! Trying another random ID...");
      fetchRandomArtwork(); // Retry with another random ID
      return;
    }

    const objectData = JSON.parse(this.responseText);

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
            <button class="bg-[#743051] rounded p-3 px-4 text-white my-5 text-sm font-semibold hover:shadow-xl">
              ADD TO FAVORITE
            </button>
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
  });
}

// Function to fetch a random artwork
function fetchRandomArtwork() {
  const randomId = Math.floor(Math.random() * 10000); // Random number between 0 and 9999
  fetchData(randomId); // Try fetching the random artwork
}

// Fetch the first random artwork when the page loads
fetchRandomArtwork();
