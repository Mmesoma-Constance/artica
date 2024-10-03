"use strict";

const details = document.querySelector(".details");

// Specify the object ID you want to fetch (replace with a valid object ID)
const objectId = 50; // Example object ID

const request = new XMLHttpRequest();
// request.open(
//   "GET",
//   `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
// );
request.open("GET", `https://api.artic.edu/api/v1/artworks/129814`);

request.send();

request.addEventListener("load", function () {
  const objectData = JSON.parse(this.responseText);

  const imageId = objectData.data.image_id;
  const iiifUrl = objectData.config.iiif_url;

  const imageUrl = `${iiifUrl}/${imageId}/full/843,/0/default.jpg`;

  const artworkDetails = {
    title: objectData.data.title,
    artistName: objectData.data.artist_title,
    artistDescription:
      objectData.data.artist_description || "No description available",
    artistBirthYear: objectData.data.artist_birth_year,
    artistDeathYear: objectData.data.artist_death_year,
    artistNationality: objectData.data.artist_nationality,
    date: objectData.data.date_display,
    medium: objectData.data.medium_display,
    dimensions: objectData.data.dimensions,
    description:
      objectData.data.exhibition_description || "No description available",
    creditLine: objectData.data.credit_line,
    imageId: objectData.data.image_id,
    imageUrl: `${objectData.config.iiif_url}/${objectData.data.image_id}/full/843,/0/default.jpg`,
    exhibitionName: objectData.data.exhibition_title,
    exhibitionDates: objectData.data.exhibition_dates,
    location: objectData.data.exhibition_location,
    artMovement: objectData.data.art_movement || "Not specified",
    relatedArtists: objectData.data.related_artists || [],
    price: objectData.data.price || "Not for sale",
    purchaseInfo: objectData.data.purchase_info || "Contact for details",
  };

  // Log the extracted data
  console.log(artworkDetails);

  // Logs details of the fetched object
  console.log(objectData);

  //   const html = `
  //   <div class="image">
  //     <img src="${objectData.primaryImage}" alt="" class="w-[400px]" />
  //     <h2>YEAR: ${objectData.accessionYear}</h2>
  //    <h2>ART NAME: ${objectData.creditLine}</h2>
  //  <h2> <a href="${objectData.objectURL}" />MORE INFO: </h2>
  //  <h2>  <a href="${objectData.objectWikidata_URL}" />READ ON WAKIPIDIA:</h2>
  // </div>
  //   `;
  //   details.insertAdjacentHTML("beforeend", html);

  const artworkHTML = `
  <div class="artwork">
  <img src="${imageUrl}" class="w-[300px]" id="artwork" />
  <h2>NAME: ${artworkDetails.artistName}</h2>
</div>
`;
  details.insertAdjacentHTML("beforeend", artworkHTML);

  // Facebook share button
  document
    .getElementById("facebook-share")
    .addEventListener("click", function () {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        imageUrl
      )}`;
      window.open(facebookUrl, "_blank");
    });

  // Twitter share button
  document
    .getElementById("twitter-share")
    .addEventListener("click", function () {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        artworkDetails.artistName
      )}&url=${encodeURIComponent(imageUrl)}`;
      window.open(twitterUrl, "_blank");
    });

  document
    .getElementById("download-button")
    .addEventListener("click", function () {
      const imageLink = document.getElementById("artwork").src; // Get the image source URL
      const link = document.createElement("a"); // Create an anchor element
      link.href = imageLink; // Set the href to the image URL
      link.download = imageUrl; // Set the download attribute with a filename
      document.body.appendChild(link); // Append the link to the body (required for Firefox)
      link.click(); // Trigger the download
      document.body.removeChild(link); // Remove the link after triggering the download
    });

  // Displaying specific data (Title and Artist) of the object
  console.log(
    `Title: ${objectData.title}, Artist: ${objectData.artistDisplayName}`
  );
});

// smooth scroll navigation bar
document.querySelector(".nav-links").addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav-link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  }
});
