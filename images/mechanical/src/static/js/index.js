const BASE_URI = "https://api.datacratie.cc"
const USE_SMALL_IMAGES = true;
const SCROLLTIME = 200;

let scrolling = true;
let currentlyWatching = {};
const currentImages = [];

function fetchImages() {
  fetch(BASE_URI + "/annotation/random")
    .then(r => r.json())
    .then((data) => {
      console.log(data);
      data.forEach((item) => currentImages.push(item))
    })
}

function renderLoop() {
  if(scrolling) {
    renderItem();
    currentImages.shift();
    if(currentImages.length <= 3) { fetchImages()}
    const to = setTimeout(() => {
      renderLoop()
    }, SCROLLTIME);
  }
  else {
  }
}


function renderItem() {
  const el = currentImages[0];
  currentlyWatching = el;
  let colorItems = ""
  if(el) {
    if( el.colordata && el.colordata.colors) {
      el.colordata.colors.forEach((color) => {
        colorItems += `<div class="color" style="background: rgba(${color[0]}, ${color[1]}, ${color[2]}, 1);"></div>`
      })
    }   
    const htmlString =  `
    <div class="itemFromCollection">
      <div class="colors">
        ${colorItems}
      </div>
      <div class="imageHolder">
        <img id="currentImage" src="${imageURIGenerator(el.gentImageURI)}" onerror="this.onerror=null; this.src='${imageURIGenerator(el.gentImageURI, true)}'"/>
      </div>  
      <h1><mark>${el.annotation}</mark></h1>
      <p>${el.originalAnnotation}</p>
      
    </div> `
    document.getElementById("approveContainer").innerHTML = htmlString;
  }

}

function initEvents() {
  document.addEventListener('keydown', function(event) {
    // n = 78
    // space = 32
    // y = 89
    event.preventDefault();
    if(event.keyCode == 32) {
      scrolling = false;
      const img = document.getElementById("currentImage");
      img.src = imageURIGenerator(currentlyWatching.gentImageURI, true)
    }
    if(event.keyCode == 89) {
      vote(true);
    }
    if(event.keyCode == 78) {
      vote(false);
    }
  });

}
function vote(approved) {

  fetch("https://api.datacratie.cc/approvals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      originID: currentlyWatching.originID, 
      annotationUUID: currentlyWatching.id, 
      workerID: "TEST", 
      collection: currentlyWatching.collection, 
      approved: approved
    })
  })
    .then(r => r.json())
    .then((data) => {
      console.log(data)
      scrolling = true
      renderLoop();
    })
    .catch((error) => {
      console.error(error);
      scrolling = true;
      renderLoop();
    })
}
function imageURIGenerator(gentImageURI, override = false) {
  if(USE_SMALL_IMAGES && !override) {
    return `https://media.datacratie.cc/pictograms/${gentImageURI}`
  }
  return `https://api.collectie.gent/iiif/imageiiif/3/${gentImageURI}/full/^1000,/0/default.jpg`

}
initEvents();
fetchImages()
renderLoop()