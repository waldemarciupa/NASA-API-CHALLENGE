const searchInput = document.querySelector(".gallery__input");
const searchBtn = document.querySelector(".gallery__button");
const galleryContainer = document.querySelector(".gallery__container");

searchBtn.addEventListener("click", function(e) {
  e.preventDefault();
  const q = searchInput.value;
  axios({
    method: "get",
    url: `https://images-api.nasa.gov/search?q=${q}`
  }).then(res => {
    const eachItem = res.data.collection.items;
    for (const el of eachItem) {
      const imageEl = document.createElement("div");
      imageEl.innerHTML = `<img class="image" src="${el.links[0].href}">`;
      galleryContainer.appendChild(imageEl);
      console.log(el.links[0].href);
    }
  });
});
