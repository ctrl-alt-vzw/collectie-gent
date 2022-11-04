
let d = [];

function fetchAnnotations(id = 0, cb) {
  console.log("fetching", id)
  fetch("https://api.datacratie.cc/annotation/startingfrom/"+id)
    .then(r => r.json()) 
    .then((data) => {
      cb(data);
    })
}

function flagAnnotation(UUID) {
  fetch("https://api.datacratie.cc/annotation/"+UUID+"/flag")
    .then(r => r.json()) 
    .then((data) => {
      console.log(data)
    })
  }


function render(data) {
  const container = document.getElementById("container")
  container.innerHTML = "";

  data.forEach((element) => {
    const imageURL = `https://api.collectie.gent/iiif/imageiiif/3/${element.gentImageURI}/full/^1000,/0/default.jpg`
    const htmlString = `
      <div class="item">
        <img src="${imageURL}" />
        <h1>${element.annotation}</h1>
        <p>${element.originalAnnotation}</p>
        <p>${element.collection}</p>
        <button id="button-${element.UUID}" elementUUID="${element.UUID}">FLAG</button>
      </div>

    `
    container.innerHTML += htmlString

  })

  data.forEach((element) => {
    

    document.getElementById(`button-${element.UUID}`).addEventListener("click", (e) => {
      console.log("clicked")
      flagAnnotation(e.target.attributes.elementuuid.value)
    })
  })
}

function init() {
  document.getElementById("next").addEventListener("click", () => {
    console.log("init")
    if(d.length > 0) {
      const last = d[d.length - 1].id
      fetchAnnotations(last, (data) => {
        d = data;
        render(data)
      })

    }
    else {
      fetchAnnotations(0, (data) => {
        d = data;
        render(data)
      })

    }
  })
  fetchAnnotations(0, (data) => {
    d = data;
    render(data)
  })
}
init()