// import * as bootstrap from "bootstrap";
// import { favourite } from "./script.js";

// export function createCarouselItem(imgSrc, imgAlt, imgId) {
function createCarouselItem(imgSrc, imgAlt, imgId) {
  const template = document.querySelector("#carouselItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);

  const img = clone.querySelector("img");
  img.src = imgSrc;
  img.alt = imgAlt;

  const favBtn = clone.querySelector(".favourite-button");
  favBtn.addEventListener("click", () => {
    favourite(imgId);
  });

  return clone;
}

// export function clear() {
function clear() {
  const carousel = document.querySelector("#carouselInner");
  while (carousel.firstChild) {
    carousel.removeChild(carousel.firstChild);
  }
}

// export function appendCarousel(element) {
function appendCarousel(element) {
  const carousel = document.querySelector("#carouselInner");

  const activeItem = document.querySelector(".carousel-item.active");
  if (!activeItem) element.classList.add("active");

  carousel.appendChild(element);
}

// export function start() {
function start() {
  const multipleCardCarousel = document.querySelector(
    "#carouselExampleControls"
  );
  if (window.matchMedia("(min-width: 768px)").matches) {
    const carousel = new bootstrap.Carousel(multipleCardCarousel, {
      interval: false
    });
    const carouselWidth = $(".carousel-inner")[0].scrollWidth;
    const cardWidth = $(".carousel-item").width();
    let scrollPosition = 0;
    $("#carouselExampleControls .carousel-control-next").unbind();
    $("#carouselExampleControls .carousel-control-next").on(
      "click",
      function () {
        if (scrollPosition < carouselWidth - cardWidth * 4) {
          scrollPosition += cardWidth;
          $("#carouselExampleControls .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      }
    );
    $("#carouselExampleControls .carousel-control-prev").unbind();
    $("#carouselExampleControls .carousel-control-prev").on(
      "click",
      function () {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          $("#carouselExampleControls .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      }
    );
  } else {
    $(multipleCardCarousel).addClass("slide");
  }
}

// import * as Carousel from "./Carousel.js";
// import axios from "axios";

// Body Element for step 7
const body = document.querySelector("body")
// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");
getFavouritesBtn.addEventListener('click', getFavourites)

// console.log(breedSelect);
// console.log(infoDump);
// console.log(progressBar);
// console.log(getFavouritesBtn);

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_MX5CU9Yi0ZSHqrOdmoYqNnPix9AWReiQphPlpdWSNGD4jpqm23TTVf5bzI3d4Y2I";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

const descriptions = []
initialLoad()
// axios.defaults.headers.common['x-api-key'] = API_KEY;
// axios.defaults.headers.common['x-api-host'] = 'https://api.thecatapi.com/v1/'


async function initialLoad() {
  const api = 'https://api.thecatapi.com/v1/breeds'
  const config = {
    baseURL: 'https://api.thecatapi.com/v1/',
		headers: {
      'Content-Type': 'application/json',
			'x-api-host': api,
			'x-api-key': API_KEY
		}
	};

  try {
    const response = await axios.get(api, config);
    console.log("Initial Load", response);

    response.data.forEach((breed) => {
      const optionHtml = document.createElement('option')
      optionHtml.value = breed.id
      optionHtml.innerText = breed.name
      breedSelect.append(optionHtml)

      const info = {
        id: breed.id,
        description: breed.description
      }
      descriptions.push(info) 
    })

    // Populate with selected breed upon page load 
    selectBreed({target: breedSelect})

    // return data
  } catch (error) {
    console.log(error);
  }
}

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
breedSelect.addEventListener('change', selectBreed)

async function selectBreed(event) {
  console.log("Event", event);
  console.log("Target", event.target);
  console.log("Value", event.target.value);
  const breedId = event.target.value;

  // Populate infoDump with breed description
  const info = descriptions.find(item => {
    return item.id == breedId
  })
  infoDump.innerText = info.description
  
  // const api = `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${breedId}&api_key=${API_KEY}`
  const api = `https://api.thecatapi.com/v1/images/search`
  console.log(api);

  const config = {
    baseURL: 'https://api.thecatapi.com/v1/',
		headers: {
      'Content-Type': 'application/json',
			'x-api-host': api,
			'x-api-key': API_KEY
		},
    params: {
      limit: 10, 
      breed_ids: breedId,
      api_key: API_KEY
    },
    onDownloadProgress: (progressEvent) => {
      updateProgress(progressEvent)
    }
	};
  
  try {
    clear() // clear Carousel of previous images

    const response = await axios.get(api, config);

    console.log("Breed response", response.data);
    response.data.forEach((element) => {
      const imgSrc = element.url
      const imgAlt = element.breeds.description
      const imgId = element.id
      const item = createCarouselItem(imgSrc, imgAlt, imgId)
      appendCarousel(item)
    })

    start() // run Carousel with new images
  } catch (error) {
    console.log(error);
  }
}

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
  // axios.html runs script src/axios.js

/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
axios.interceptors.request.use(request => {
  progressBar.style.width = '0%'
  body.style.cursor = 'progress'
  request.metadata = request.metadata || {};
  request.metadata.startTime = new Date().getTime();
  return request;
});

axios.interceptors.response.use(
  (response) => {
    response.config.metadata.endTime = new Date().getTime();
    response.config.metadata.durationInMS = response.config.metadata.endTime - response.config.metadata.startTime;
    
    console.log(`Request took ${response.config.metadata.durationInMS} milliseconds.`)
    body.style.cursor = 'default'
    return response;
  },
  (error) => {
    error.config.metadata.endTime = new Date().getTime();
    error.config.metadata.durationInMS = error.config.metadata.endTime - error.config.metadata.startTime;

    console.log(`Request took ${error.config.metadata.durationInMS} milliseconds.`)
    throw error;
});

/**
 6. Next, we'll create a progress bar to indicate the request is in progress.
  * The progressBar element has already been created for you.
    - You need only to modify its "width" style property to align with the request progress.
  * In your request interceptor, set the width of the progressBar element to 0%.
    - This is to reset the progress with each request.
  * Research the axios onDownloadProgress config option.
  * Create a function "updateProgress" that receives a ProgressEvent object.
    - Pass this function to the axios onDownloadProgress config option in your event handler.
  * console.log your ProgressEvent object within updateProgress, and familiarize yourself with its structure.
    - Update the progress of the request using the properties you are given.
  * Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire once or twice per request to this API. This is still a concept worth familiarizing yourself with for future projects.
 */
function updateProgress(progressEvent) {
  console.log(progressEvent)
  let width = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  progressBar.style.width = `${width}%`

  console.log("width", width);
}

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
// export async function favourite(imgId) {
async function favourite(imgId) {
  const api = `https://api.thecatapi.com/v1/favourites/`

  const rawBody = JSON.stringify({ 
    "image_id": imgId,
    // "sub_id":"user-123"
  });
  console.log("URL", api);
  console.log("Image", rawBody);
  console.log("API key", API_KEY);

  const config = {
    baseURL: 'https://api.thecatapi.com/v1/',
		headers: {
      'Content-Type': 'application/json',
			'x-api-host': api,
			'x-api-key': API_KEY
    },
	};

    // const favs = getFavourites()
    const favorites = await axios.get(api, config)
    console.log(favorites.data);
  
    const thisImage = favorites.data.find((item) => {
      console.log(item.image_id, imgId);
      return item.image_id == imgId
    })
    console.log("This image", thisImage);

  try {
    if (thisImage) {
      console.log('Delete this image from favs');
      const deleteImage = axios.delete(api+thisImage.id, config)
    } else {
      console.log('Add this image to favs');
      const response = await axios.post(api, rawBody, config)
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */
async function getFavourites() {
  const api = `https://api.thecatapi.com/v1/favourites/`

  console.log("URL", api);
  console.log("API key", API_KEY);

  const config = {
    baseURL: 'https://api.thecatapi.com/v1/',
		headers: {
      'Content-Type': 'application/json',
			'x-api-host': api,
			'x-api-key': API_KEY
    },
	};

  try {
    clear() // clear Carousel of previous images

    const response = await axios.get(api, config)
    console.log(response);

    response.data.forEach((element, index) => {
      const imgSrc = element.image.url
      const imgAlt = `Favorite #${index} created at ${element.created_at}`
      const imgId = element.image_id
      const item = createCarouselItem(imgSrc, imgAlt, imgId)
      appendCarousel(item)
    })

    start() // run Carousel with favourite images
  } catch (error) {
    console.log(error);
  }
}


/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
