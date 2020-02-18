const banner = document.querySelector('.banner__container');
const galleryForm = document.querySelector('.gallery__form');
const searchInput = document.querySelector('.gallery__input');
const searchBtn = document.querySelector('.gallery__button--search');
// const gallery = document.querySelector(".gallery");
const galleryContainer = document.querySelector('.gallery__container');
const loadBtn = document.querySelector('.gallery__button--load');

axios({
  method: 'get',
  url: `https://api.nasa.gov/planetary/apod?api_key=KuhcmbrqkhYiFsIwuwVfOR2MCtIwXs6yPs6czrGL`
}).then(res => {
  console.log(banner);
  banner.style.background = `url(${res.data.url})`;
  banner.style.backgroundRepeat = `no-repeat`;
  banner.style.backgroundSize = `cover`;

  console.log(res.data.url);
}).catch(function (error) {
  console.log(error);
})

searchBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const q = searchInput.value;
  axios({
    method: 'get',
    url: `https://images-api.nasa.gov/search?q=${q}`,
    // data: {
    //   per_page: 5
    // }
  }).then(res => {

    if (res.data.collection.items.length > 0) {
      // clear gallery
      while (galleryContainer.firstChild)
        galleryContainer.removeChild(galleryContainer.firstChild);
      searchInput.value = "";

      // load gallery

      const eachItem = res.data.collection.items;

      function loadGallery(i) {
        const imgUrl = eachItem[i].links[0].href;
        const imageTitle = eachItem[i].data[0].title;
        const imageDescription = eachItem[i].data[0].description;
        const imageEl = document.createElement('div');

        // create image
        imageEl.classList.add('imageBox');
        imageEl.innerHTML =
          `<img class="image" 
            src="${imgUrl}"
            title="${imageTitle}"
            data-description="${imageDescription}"
            >`
        galleryContainer.appendChild(imageEl);

        // checking is it end of data
        const galleryImages = document.querySelectorAll('.gallery__container div');
        if (res.data.collection.items.length === galleryImages.length) {
          loadBtn.classList.remove('show');
          loadBtn.classList.add('hide');
          const infoBox = document.createElement('div');
          infoBox.innerHTML = `<p style="color: white">There is no more data.</p>`;
          galleryContainer.appendChild(infoBox);
        }

        // gallery
        function gallery(gallery) {
          if (!gallery) {
            throw new Error('No gallery found')
          }
          const images = Array.from(galleryImages);
          // console.log(images);
          const modal = document.querySelector('.gallery__modal');
          const prevBtn = document.querySelector('.prev')
          const nextBtn = document.querySelector('.next')
          let currentImage;

          function openModal() {
            // checking is modal open
            if (modal.matches('.open')) {
              // console.info('Modal already open');
              return;
            }
            modal.classList.add('open');

            window.addEventListener('keyup', handleKeyUp);
            nextBtn.addEventListener('click', showNextImage);
            prevBtn.addEventListener('click', showPrevImage);
          }

          function showNextImage(e) {
            // console.log(e);
            // e.stopImmediatePropagation();
            showImage(currentImage.nextElementSibling || galleryContainer.firstElementChild);
          }

          function showPrevImage(e) {
            // console.log(e);
            // e.stopImmediatePropagation();
            showImage(currentImage.previousElementSibling || galleryContainer.lastElementChild);
          }

          function closeModal() {
            modal.classList.remove('open');

            window.removeEventListener('keyup', handleKeyUp);
            prevBtn.removeEventListener('click', showPrevImage);
            nextBtn.removeEventListener('click', showNextImage);

          }

          function clickOutside(e) {
            e.stopImmediatePropagation();
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }

          function handleKeyUp(e) {
            // e.stopImmediatePropagation();
            if (e.key === 'Escape') return closeModal();
            if (e.key === 'ArrowRight') return showNextImage();
            if (e.key === 'ArrowLeft') return showPrevImage();

          }

          function showImage(el) {
            if (!el) {
              console.log('there is no image to show!');
              return
            } else {
              // console.dir(el);

              modal.querySelector('img').src = el.firstChild.src;
              modal.querySelector('h2').textContent = el.firstChild.title;
              // modal.querySelector('p').textContent = el.firstChild.dataset.description;
              currentImage = el;
              openModal();
            }
          }

          // events

          images.forEach(function (image) {
            image.addEventListener('click', function (event) {
              event.stopImmediatePropagation();
              showImage(event.currentTarget);
            })
          })

          modal.addEventListener('click', clickOutside);


        }


        gallery(galleryContainer)
      }

      // load first gallery
      for (let i = 0; i < 20; i++) {
        if (eachItem[i].links) {
          loadGallery(i)
        } else {
          const errorBox = document.createElement('div');
          errorBox.innerHTML = `<p style="color: white">Oops, something went wrong!</p>`;
          galleryContainer.appendChild(errorBox);
          return
        }
      }

      loadBtn.classList.remove('hide');
      loadBtn.classList.add('show');

      // load more
      // let counter;
      // let start = 0;
      // let all = 20;

      let counter = 20;

      loadBtn.addEventListener('click', function () {
        // counter++;
        // if (counter === 0) {
        //   start = start;
        //   all = all;
        // } else {
        //   start = start + 20;
        //   all = all + 20;
        // }

        for (let i = counter; i < counter + 20; i++) {
          if (eachItem[i]) {
            loadGallery(i)
          } else {
            break;
          }
        }
        counter += 20;
      });

    } else {
      while (galleryContainer.firstChild)
        galleryContainer.removeChild(galleryContainer.firstChild);
      searchInput.value = "";
      loadBtn.classList.remove('show');
      loadBtn.classList.add('hide');
      const errorBox = document.createElement('div');
      errorBox.innerHTML = `<p style="color: white">Oops, something went wrong! Probably there is no data like you are looking for...</p>`;
      galleryContainer.appendChild(errorBox);
    }
  }).catch(function (error) {
    console.log(error);
  });
});