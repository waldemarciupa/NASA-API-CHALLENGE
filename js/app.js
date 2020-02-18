const galleryForm = document.querySelector(".gallery__form");
const searchInput = document.querySelector(".gallery__input");
const searchBtn = document.querySelector(".gallery__button--search");
const gallery = document.querySelector(".gallery");
const galleryContainer = document.querySelector(".gallery__container");
const loadBtn = document.querySelector(".gallery__button--load");



searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const q = searchInput.value;
  axios({
    method: "get",
    url: `https://images-api.nasa.gov/search?q=${q}`,
    data: {
      per_page: 5
    }
  }).then(res => {

    if (res.data.collection.items.length > 0) {
      // clear gallery
      while (galleryContainer.firstChild)
        galleryContainer.removeChild(galleryContainer.firstChild);
      searchInput.value = "";

      const eachItem = res.data.collection.items;

      // Function loadGallery 
      // function loadGallery(i) {
      //   const imgUrl = eachItem[i].links[0].href;
      //   const imageEl = document.createElement("img");
      //   imageEl.src = imgUrl;
      //   imageEl.classList.add("image");
      //   galleryContainer.appendChild(imageEl);

      // }

      function loadGallery(i) {
        const imgUrl = eachItem[i].links[0].href;
        const imageEl = document.createElement("div");
        imageEl.classList.add('imageBox');
        imageEl.innerHTML =
          `<img class="image" src="${imgUrl}">`

        // imgUrl;
        // imageEl.classList.add("image");
        galleryContainer.appendChild(imageEl);

      }

      // load first gallery
      for (let i = 0; i < 20; i++) {
        loadGallery(i)
      }

      loadBtn.classList.remove("hide");
      loadBtn.classList.add("show");

      // load more
      let counter;
      let start = 0;
      let all = 20;

      loadBtn.addEventListener("click", function () {
        counter++;
        if (counter === 0) {
          start = start;
          all = all;
        } else {
          start = start + 20;
          all = all + 20;
        }

        for (var i = start; i < all; i++) {
          loadGallery(i)
        }
        const galleryImages = document.querySelectorAll('.gallery__container img');
        if (res.data.collection.items.length === galleryImages.length) {
          console.log('its over');
          loadBtn.classList.remove("show");
          loadBtn.classList.add("hide");
          const infoBox = document.createElement("div");
          infoBox.innerHTML = `<p style="color: white">There is no more data.</p>`;
          galleryContainer.appendChild(infoBox);
        }
      });

    } else {
      while (galleryContainer.firstChild)
        galleryContainer.removeChild(galleryContainer.firstChild);
      searchInput.value = "";
      loadBtn.classList.remove("show");
      loadBtn.classList.add("hide");
      const errorBox = document.createElement("div");
      errorBox.innerHTML = `<p style="color: white">Oops, something went wrong! Probably there is no data like you are looking for...</p>`;
      galleryContainer.appendChild(errorBox);
    }
  }).catch(function (error) {
    console.log(error);
  });
});