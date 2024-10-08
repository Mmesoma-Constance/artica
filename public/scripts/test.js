const request = new XMLHttpRequest();
request.open("GET", "https://api.artic.edu/api/v1/artworks");
request.send();
console.log(request.responseText);

request.addEventListener("load", function () {
  const data = JSON.parse(this.responseText);
  console.log(data);
});
