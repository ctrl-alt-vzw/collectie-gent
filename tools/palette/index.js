var palette = require('image-palette')
var pixels = require('image-pixels')
 

async function getPalette(e) {
  try {
    console.log(e.gentImageURI)
    const str = `https://api.collectie.gent/iiif/imageiiif/3/${e.gentImageURI}/full/^1000,/0/default.jpg`;
    const alt = str.replace(" ", "%20");
    console.log(alt)
    const p = await pixels(alt);
    var {ids, colors} = await palette(p)
    console.log("sending")
    sendData(e, { colors: colors})
  } catch(e) {
    // sendData(e, null)
      console.log(e)
      handling+=1;
      recurse();

  }
}

let handling = 0;
let data = []

function getData() {
  fetch("https://api.datacratie.cc/annotation/byQuery/colorData IS NULL LIMIT 50")
    .then(r => r.json())
    .then((d) => {
      data = d.rows;
      handling = 0;
      console.log(data.length)
      recurse()
    })
    .catch(e => {
      handling = 0;
      setTimeout(() => getData(), 1000)
    })
}

function recurse() {
  if(data[handling]) {
    const current = data[handling];
    console.log(current.id)
    getPalette(current);
  } else {
    getData();
  }
}


function sendData(e, colors) {
  console.log(colors)
  fetch("https://api.datacratie.cc/annotation/" + e.UUID + "/colordata", {
    method: "PATCH",
    body: JSON.stringify(colors),
    headers: {
        "Content-Type": "application/json"
      },
  })
    .then(r => r.text())
    .then((data) => {
      handling+=1;
      recurse();
      console.log("updated as", data)
    })
  
}

getData();