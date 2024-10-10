const request = new XMLHttpRequest();

request.open(
  "GET",
  `https://collectionapi.metmuseum.org/public/collection/v1/objects/6943`
);
request.send();
console.log(request.responseText);

request.addEventListener("load", function () {
  const data = JSON.parse(this.responseText);
  console.log(data);
});
