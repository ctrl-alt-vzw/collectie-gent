// import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

// const socket = io("ws://localhost:3004")

// socket.on("ping", (arg)=> {
//   console.log(arg)
//   socket.emit("pong", {})
// });

let clippings = [];

let SCALE = 1;
let lastScale = 1;
let SIZE = 200 * SCALE;

let vpx, vpy, vzl = 1;
let svpx = 0;
let svpy = 0;
let lax = 0;
let lay = 0;
let svzl = 0;

let zax = 0;
let zay = 0;


let mouseDown = false;
let mouseStart = { x: -1, y: -1};
let mouseDifference = { x: 0, y: 0 };
let ticking = false;
let mousewheelMillis = millis();
let adjustScale = false;
let containerWidth = 2000;


let highlighted = null;
function initMovements() {

  const innerWidth = window.innerWidth;

  const ratio = innerWidth / containerWidth;

  SCALE = 1;
  lastScale = SCALE;
  SIZE = 200 * SCALE;

  vpx = 0;
  vpy = 0;
  lax = window.innerWidth / 2;
  lay = window.innerHeight / 2;
  vzl = 1;

  // check if render is needed
  
  window.addEventListener("wheel", (e) => {
    mousewheelMillis = millis();
    adjustScale = true;
    vzl += e.deltaY * -0.01;
    vzl = Math.min(Math.max(.5, vzl), 2);
    
    SCALE = vzl;
    SIZE = 200 * SCALE;
    render();
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

    lax = lax - svpx;
    lay = lay - svpy;

    if(Math.abs(mouseDifference.x + mouseDifference.y) < 10) {
      handleClick(mousePosition(e))
    }

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
}



function init() {
  const canvas = document.getElementById('container');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initMovements();
  fetchData();   
}

function handleClick(e) {
  // console.log(e)
  // if(highlighted) {
  //   highlighted = null;
  // } else {
  //   const threshold = 20;
  //   const options = clippings.filter((item) => {
  //     const withinX = e.x > item.x && e.x < item.x + item.width;
  //     const withinY = e.y > item.y && e.y < item.y + item.height;
  //     return withinX && withinY
  //   })
  //   highlighted = options.sort((a, b) => a.sortID - b.sortID)[0];

  // }
  // render();
}

function fetchData() {

  fetch("https://api.datacratie.cc/clipping")
    .then(r => r.json())
    .then((data) => {
      console.log(data)
      const capture = [];
      data.forEach((item, index) => {
        const c = new Clipping(item);
        capture.push(c);

        if(index == data.length-1) {
          clippings = capture.sort((a, b) => b.sortID - a.sortID);
          render();
        }
      })
    })
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
function map(number, in_min, in_max, out_min, out_max) {
  return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function render() {
  const canvas = document.getElementById('container');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.rect(lax + vpx, lay + vpy, 10, 10); 
  ctx.stroke(); 

  if(adjustScale) {
    if(lastScale !== SCALE) {
      zax = map(SCALE, 0, 2, canvas.width / 2, -canvas.width / 2);
      zay = map(SCALE, 0, 2, canvas.height / 2, -canvas.height / 2);;
    }
    svpx = 0;
    svpy = 0;
    adjustScale = false;
    lastScale = SCALE;
    clippings.forEach((item, index) => {
      item.updateStats();
    })
  }
  clippings.forEach((item, index) => {
    item.updatePosition();
    item.render(ctx);
  })


  if(highlighted) {
    highlighted.renderHighlighted(ctx);
  }
}

init();

class Clipping {
  constructor(data) {
    this.received = data;
    this.sortID = data.id;
    this.id = data.UUID;
    this.bx = data.x ;
    this.by = data.y ;
    this.w = data.width;
    this.h = data.height;
    this.imageURL = data.imageURI;
    this.curZoomLevel = 0;
    this.getImage();
    this.updateStats();
  }
  updatePosition() {
    this.x = (this.bx + vpx + svpx) * SCALE + zax;
    this.y = (this.by + vpy + svpy) * SCALE + zay;
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
    if(this.x + this.width > 0 && this.x < window.innerWidth && this.y + this.height > 0 && this.y < window.innerHeight) {
      this.getImage(SCALE);
    }
  }
  getImage(zoomlevel = 1) {
    const levels = ["/50/", "/200/", "/full/"];
    const index = Math.floor((zoomlevel / 2) * levels.length);
    if(index !== Math.floor((this.curZoomLevel/2) * levels.length)) {
      try { 
        this.img = new Image();   // Create new img element
        this.img.addEventListener('load', () => {
        }, false);
        this.img.addEventListener('error', () => {
          this.img = null;
        }, false);
        this.curZoomLevel = zoomlevel;
        this.img.src = this.imageURL.replace("/800/", levels[index]);
      }
      catch(e) {

      }
    }
  }
  renderHighlighted(ctx) {
    ctx.globalAlpha = 1;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.beginPath();
    const w = 200;
    const h = 200;
    const s = 20;
    ctx.lineWidth = s;  
    ctx.strokeRect(this.x - s, this.y - s, w + s*2, h + s*2);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "rgba(1, 1, 1, 0)";
    ctx.beginPath();
    ctx.rect(this.x - s - s/2, this.y + h + s, w + s*2 + s, 100);
    ctx.fill()
  }
  render(ctx) {
    if(this.img) {
      if(this.x + this.width > 0 && this.x < window.innerWidth && this.y + this.height > 0 && this.y < window.innerHeight) {
        if(highlighted) {
          ctx.globalAlpha = 0.2
        } else {
          ctx.globalAlpha = 1
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    }
  }
}

function mousePosition(e)
{
    var posX = e.clientX;
    var posY = e.clientY;
    return { x: posX, y: posY}
}
function millis() {
  return new Date().getTime();
}