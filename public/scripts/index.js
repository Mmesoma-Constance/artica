// sticky navbar
export function stickyNav() {
  const nav = document.querySelector(".nav");
  const section1 = document.querySelector("#section--0");
  const initalCoords = section1.getBoundingClientRect();
  console.log(initalCoords);

  window.addEventListener("scroll", function () {
    // console.log(window.scrollY);

    if (window.scrollY > initalCoords.top) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
  });

  // sticky navbar : interactive observer API

  const obsCallback = function (entries, observer) {
    entries.forEach((entry) => {
      console.log(entry);
    });
  };
  const obsOptions = {
    root: null,
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(obsCallback, obsOptions);
  observer.observe(section1);
}

stickyNav();



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
