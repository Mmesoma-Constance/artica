function exhibitionArtworks() {
  const details = document.querySelector(".exhibition-container");

  // Array of artwork IDs (replace these with the actual IDs of your choice)
  const artworkIds = [16146, 566, 65008];

  // Array of custom descriptions for each artwork
  const customDescription = [
    {
      descriptions:
        "This painting by Toulouse-Lautrec captures a female performer at the circus, riding a horse with grace and energy. Using bold colors and dynamic brushstrokes, Lautrec portrays the lively atmosphere of Parisian entertainment culture.",
      date: "October 22, 2024 - October 30 2024,",
    },
    {
      descriptions:
        "This life cast of Abraham Lincoln, created by Leonard Wells Volk, captures the detailed likeness of Lincoln’s hands and face just before his election. The bronze cast offers a rare, intimate view of Lincoln during a key moment in his life.",
      date: "November 22, 2024 - November 30 2024,",
    },
    {
      descriptions:
        "Paul Manship's The Horses of Anahita (1942) showcases the powerful and graceful forms of horses, inspired by the ancient Persian goddess Anahita. The dynamic composition and elegant figures reflect Manship's classical influence, blending mythology with his signature Art Deco style.",
      date: "December 22, 2024 - December 30 2024,",
    },
  ];

  // Loop over each artwork ID to fetch data
  artworkIds.forEach((artworkId, index) => {
    const request = new XMLHttpRequest();

    // Request the specific artwork using its ID
    request.open("GET", `https://api.artic.edu/api/v1/artworks/${artworkId}`);
    request.send();

    request.addEventListener("load", function () {
      const objectData = JSON.parse(this.responseText); // Parse the response

      // Extract the image ID from the API response
      const imageId = objectData.data.image_id;
      const iiifUrl = objectData.config.iiif_url;

      // Create the image URL for the specific artwork
      const imageUrl = imageId
        ? `${iiifUrl}/${imageId}/full/843,/0/default.jpg`
        : "default-image.jpg";

      // Create an object with the artwork details, including custom description
      const artworkDetails = {
        title: objectData.data.title,
        artistName: objectData.data.artist_title || "Unknown Artist",
        customDescription: customDescription[index].descriptions, // Use the corresponding description from the array
        exhibitionDate: customDescription[index].date, // Use the corresponding date from the array
      };

      // Log the extracted details for debugging
      console.log(artworkDetails);

      // Create HTML content to display the artwork
      const artworkHTML = `
           <div
            class="flex flex-col lg:flex-row justify-between gap-5 md:gap-10 items-center"
          >
            <div class="lg:w-[50%]">
              <img
                src="${imageUrl}"
                class="w-full h-[320px] object-cover"
                alt="${artworkDetails.title}"
              />
            </div>
            <div class="lg:w-[50%]">
              <h2 class="font-extrabold text-2xl text-[#743051]">
              ${artworkDetails.title}
              </h2>
              <h3 class="flex flex-col smlg:flex-row smlg:gap-3 pt-2 md:pt-0">
                <span class="font-bold">NEW YORK</span>
                <div class="flex items-center">
                  <img src="icons/calender.png" class="w-5 h-4 object-cover" />
                  <span>${artworkDetails.exhibitionDate}</span>
                </div>
              </h3>
              <p class="pt-4">
              ${artworkDetails.customDescription}
              </p>
              <a href="artpage.html?id=${artworkId}"
                ><button
                  class="my-6 p-3 px-8 border border-[#743051] text-[#743051] font-bold rounded text-sm hover:bg-[#743051] hover:text-white transition-all"
                >
                  MORE INFO
                </button></a
              >
            </div>
          </div>
        <hr/>
        `;

      // Insert the artwork HTML into the container
      details.insertAdjacentHTML("beforeend", artworkHTML);
    });
  });
}

exhibitionArtworks();

let random = Math.floor(Math.random() * 100) + 1;
console.log(random);

// Function to fetch artworks for a specific page and limit
function fetchArtworks(page = random, limit = 20) {
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

    const limitedData = objectData.data.slice(4, 10);

    console.log("Total artworks returned:", limitedData.length); // Check how many items are returned

    // Clear the container before adding new artworks
    const artContainer = document.querySelector(".artContainer");
    artContainer.innerHTML = "";

    // Iterate over the artworks data and inject HTML
    limitedData.forEach((artwork) => {
      const imageUrl = `${objectData.config.iiif_url}/${artwork.image_id}/full/843,/0/default.jpg`;

      const img = new Image();
      img.src = imageUrl;

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
  });
}

fetchArtworks(); // Adjust the page and limit as needed
