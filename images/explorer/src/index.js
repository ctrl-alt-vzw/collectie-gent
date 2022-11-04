// import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

// const socket = io("ws://localhost:3004")

// socket.on("ping", (arg)=> {
//   console.log(arg)
//   socket.emit("pong", {})
// });

const clippings = [];

let SCALE = 1;
let SIZE = 200 * SCALE;

let vpx, vpy, vzl = 1;
let svpx = 0;
let svpy = 0;
let svzl = 0;

let mouseDown = false;
let mouseStart = { x: -1, y: -1};
let mouseDifference = { x: 0, y: 0 };
let ticking = false;
let mousewheelMillis = millis();
let adjustScale = false;
let containerWidth = 2000;

function initMovements() {

  const innerWidth = window.innerWidth;

  const ratio = innerWidth / containerWidth;

  SCALE = ratio;
  SIZE = 200 * SCALE;

  vpx = 0;
  vpy = 0;
  vzl = 1;

  // check if render is needed
  setInterval(() => {
    if(millis() - mousewheelMillis > 300 && adjustScale) {
      mousewheelMillis = millis();
      render();
    }
  }, 100);
  window.addEventListener("wheel", (e) => {
    mousewheelMillis = millis();
    adjustScale = true;
    vzl += e.deltaY * -0.01;
    vzl = Math.min(Math.max(.5, vzl), 3);
    
    SCALE = vzl;
    SIZE = 200 * SCALE;

    e.preventDefault();
  })

  document.addEventListener("mousedown", (e) => {
    e.preventDefault();
    mouseDown = true;
    svpx = 0;
    svpy = 0;
  })

  document.addEventListener("mouseup", (e) => {
    e.preventDefault();
    mouseDown = false;
    vpx = vpx + svpx;
    vpy = vpy + svpy;

    mouseStart = {x: -1, y:-1};
    mouseDifference = { x: 0, y: 0 };

  })

  document.addEventListener("mousemove", (e) => {

    if (!ticking) {
      window.requestAnimationFrame(() => {
        adjustPosition(e);
        ticking = false;
      });

      ticking = true;
    }
   
  })


  fetchData();

}

function adjustPosition(e) {
   if(mouseDown) {
      if(mouseStart.y < 0 && mouseStart.x < 0) { mouseStart = mousePosition(e) }
      mouseDifference.x = mousePosition(e).x - mouseStart.x;
      mouseDifference.y = mousePosition(e).y - mouseStart.y;

      svpx = mouseDifference.x;
      svpy = mouseDifference.y;

      render();
    }
}
function fetchData() {

  fetch("https://api.datacratie.cc/clipping")
    .then(r => r.json())
    .then((data) => {
      console.log(data)

      data.forEach((item, index) => {
        const c = new Clipping(item);
        clippings.push(c);
      })

      render();
    })
}

function render() {
  console.log("rendering")
  const container = document.getElementById("container");
  console.log(vpx + svpx + "px")
  container.style.left = vpx + svpx + "px";
  container.style.top = vpy + svpy + "px";


  if(adjustScale) {
    vpx *= SCALE;
    vpy *= SCALE;
    clippings.forEach((item, index) => item.updateStats());
    adjustScale = false;
  }
  container.innerHTML = "";
  clippings.forEach((item, index) => {
    // item.updatePosition();
    container.innerHTML += item.render();
  })
}



initMovements();


function mousePosition(e)
{
    // var e = window.event;
    var posX = e.clientX;
    var posY = e.clientY;
    return { x: posX, y: posY}

}

class Clipping {
  constructor(data) {
    this.id = data.UUID;
    this.bx = data.x ;
    this.by = data.y ;
    this.w = data.width;
    this.h = data.height;
    this.image = data.imageURI.replace("/800/", "/50/");

    this.updateStats();
  }
  updateStats() {
    if(this.h > this.w) {
      this.ratio = this.w / this.h;
      this.height = SIZE;
      this.width = SIZE * this.ratio;
    } else {
      this.ratio = this.h / this.w;
      this.height = SIZE * this.ratio;
      this.width = SIZE;
    }
    this.x = this.bx * SCALE;
    this.y = this.by * SCALE;
  }
  render() {
    return `
      <div class="clipping" id="${this.id}" style="top: ${this.y}px; left: ${this.x}px; width: ${this.width}px; height: ${this.height}px">
        <img src="${this.image}" />
      </div>
    `

  }
}

function millis() {
  return new Date().getTime();
}