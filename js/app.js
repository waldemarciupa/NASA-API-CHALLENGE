const searchInput = document.querySelector(".gallery__input");
const searchBtn = document.querySelector(".gallery__button");
const galleryContainer = document.querySelector(".gallery__container");
const loadBtn = document.querySelector(".load");

searchBtn.addEventListener("click", function(e) {
  e.preventDefault();
  const q = searchInput.value;
  axios({
    method: "get",
    url: `https://images-api.nasa.gov/search?q=${q}`,
    data: {
      per_page: 5
    }
  }).then(res => {
    while (galleryContainer.firstChild)
      galleryContainer.removeChild(galleryContainer.firstChild);
    searchInput.value = "";

    const eachItem = res.data.collection.items;

    for (let i = 0; i < 16; i++) {
      const imgUrl = eachItem[i].links[0].href;
      const imageEl = document.createElement("img");
      imageEl.src = imgUrl;
      imageEl.classList.add("image");
      galleryContainer.appendChild(imageEl);
    }
    let counter;
    var start = 0;
    var all = 16;
    loadBtn.addEventListener("click", function() {
      counter++;
      if (counter === 0) {
        start = start;
        all = all;
      } else {
        start = start + 16;
        all = all + 16;
      }

      for (var i = start; i < all; i++) {
        const imgUrl = eachItem[i].links[0].href;
        const imageEl = document.createElement("img");
        imageEl.src = imgUrl;
        imageEl.classList.add("image");
        galleryContainer.appendChild(imageEl);
      }
    });
    // for (const el of eachItem) {
    //   const imageEl = document.createElement("div");
    //   imageEl.innerHTML = `<img class="image" src="${el.links[0].href}">`;
    //   galleryContainer.appendChild(imageEl);
    // }
  });
});
