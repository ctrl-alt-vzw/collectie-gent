const { mapValues } = require("./../helpers")
module.exports = class Minimap {
  constructor() {
    document.getElementById("canvasContainer").insertAdjacentHTML("beforeend", `
      <div id="minimap"></div><div id="marker"></div>
    `)

  }
  updatePosition(x, y) {
    const newX = Math.round(mapValues(x, -7500, 7500, 0, 100));
    const newY = Math.round(mapValues(y, -7500, 7500, 0, 100));

    console.log(newX, newY)
    const m = document.getElementById("marker");
    if(m) {
      m.style.left = window.innerWidth - 50 - newX + "px";
      m.style.top = window.innerHeight - 50 - newY + "px";
    }

  }

}

