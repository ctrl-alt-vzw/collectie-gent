// import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

// const socket = io("ws://localhost:3004")

// socket.on("ping", (arg)=> {
//   console.log(arg)
//   socket.emit("pong", {})
// });

let items = [];
let sorted = [];

let c = {}

let SCALE = 1;
let lastScale = 1;
let SIZE = 200 * SCALE;
let RANGE = 1000;

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
  lax = window.innerWidth / 2
  lay = window.innerHeight / 2;
  vzl = 1;

  // check if render is needed
  
  window.addEventListener("wheel", (e) => {
    mousewheelMillis = millis();
    adjustScale = true;
    vzl += e.deltaY * -0.01;
    vzl = Math.min(Math.max(.1, vzl), 10);
    
    SCALE = vzl;
    SIZE = 200 * SCALE;
    // RANGE = map(vzl, 0.1, 10, 200, 20);
    render();
    e.preventDefault();
  }, {passive:false})

  document.addEventListener("mousedown", (e) => {
    e.preventDefault();
    mouseDown = true;
    svpx = 0;
    svpy = 0;
  }, {passive:false})

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


  }, {passive:false})

  document.addEventListener("mousemove", (e) => {

    if (!ticking) {
      window.requestAnimationFrame(() => {
        adjustPosition(e);
        ticking = false;
      });

      ticking = true;
    }
   
  }, {passive:false})
}

function getNearest() {

  // /nearestWithImage
}

function init() {
  const canvas = document.getElementById('container');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initMovements();
  fetchData();   
}

function handleClick(e) {
  if(highlighted) {
    highlighted = null;
  }
  const threshold = 20;
  const options = items.filter((item) => {
    if(item.width) {
      const withinX = e.x > item.x - item.width / 2 && e.x < item.x + item.width /2;
      const withinY = e.y > item.y - item.height / 2 && e.y < item.y + item.height / 2;
      return withinX && withinY

    } else {
      const withinX = e.x > item.x && e.x < item.x + threshold;
      const withinY = e.y > item.y && e.y < item.y + threshold;
      return withinX && withinY

    }
  })
  if(options.length > 0) {
    highlighted = options[0]
    console.log(highlighted)
    console.log(highlighted.annotation)
    sortItems(highlighted);
    updatePositions();
    render();
  } else {
    console.log("nothing to select")
  }
  render();

  // window.setTimeout(() => render(), 1000)
}

function renderInformation(h) {
  document.getElementById("infoImage").src=  `https://media.collage.gent/pictograms/${h.imageURL}`;
  document.getElementById("infoTitle").innerHTML=  h.annotation;
}

function fetchData() {

  fetch("https://api.collage.gent/vertexEnriched")
    .then(r => r.json())
    .then((data) => {
      const capture = [];
      data.rows.forEach((item, index) => {
        const c = new Item(item);
        capture.push(c);

        if(index == data.rows.length-1) {
          items = capture.sort((a, b) => b.sortID - a.sortID);
          sorted = items;
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
function updatePositions() {
  const base = highlighted;
  const goldenRatio = 1 + Math.sqrt(5);
  const angleIncrement = Math.PI * 1 * goldenRatio;
  const multiplier = 50000;
  
  sorted.forEach((item, index) => {

    const distance = (index / sorted.length);
    const angle = angleIncrement * index

    const squeeze = map(index, 0, sorted.length, 1, -1)
    
    const x = base.bx + distance * Math.cos(angle) * (multiplier * squeeze)
    const y = base.by + distance * Math.sin(angle) * (multiplier * squeeze)
    item.bx = x;
    item.by = y;

    item.updatePosition();
  })
}
function map(number, in_min, in_max, out_min, out_max) {
  return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function render() {
  const canvas = document.getElementById('container');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);



  ctx.beginPath();
  ctx.fillStyle = "red"
  ctx.fillRect(lax + vpx, lay + vpy, 10, 10); 


  if(adjustScale) {
    if(lastScale !== SCALE) {
      zax = map(SCALE, 0, 2, canvas.width / 2, -canvas.width / 2);
      zay = map(SCALE, 0, 2, canvas.height / 2, -canvas.height / 2);;
    }
    svpx = 0;
    svpy = 0;
    adjustScale = false;
    lastScale = SCALE;
    items.forEach((item, index) => {
      item.updateStats();
    })
  }
  c.x = (lax+vpx);
  c.y = (lay+vpy);
  // only render the ones in view
  items.forEach((item) => { 
    if(dist(item, c) < RANGE * SCALE) {
      item.inView = true;
      
    } else {
      item.inView = false;
    }
    item.updatePosition();      
    item.render(ctx);    
    ctx.fill();
  })   
  items.forEach((item) => { 
    if(dist(item, c) < RANGE && SCALE > 3) {
      item.renderImages(ctx);
    }
  });


}

function sortItems(pickedElement) {
  sorted = items;
  const c = pickedElement;
  sorted.sort((a, b) => {
    return dist3D(a, c) - dist3D(b, c);
  })
}
function dist(a, c) {
  return Math.abs(Math.sqrt(Math.pow(a.x-c.x, 2)+Math.pow(a.y-c.y, 2)));
}
function dist3D(a, c) {
  return Math.abs(Math.sqrt(Math.pow(a.bx-c.bx, 2)+Math.pow(a.by-c.by, 2)+Math.pow(a.bz-c.bz, 2)));
}
init();

class Item {
  constructor(data) {
    this.received = data;
    this.sortID = data.id;
    this.vertexID = data.UUID;
    this.id = data.annotationUUID;
    this.annotation = data.annotation;
    this.bx = data.x * 100;
    this.by = data.y * 100;
    this.bz = data.z * 100;
    this.w = data.width;
    this.h = data.height;
    this.imageURL = data.gentImageURI;
    this.curZoomLevel = 0;
    // this.getImage();
    this.updateStats();
    this.inView = false;
    this.colordata = data.colordata.colors[0];


  }
  updatePosition() {
    // if(inView && !this.img) {
      // console.log("loading")
      // this.getImage();
    // }
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
  getImage() {
      try { 
        this.img = new Image();   // Create new img element
        this.img.addEventListener('load', () => {
        }, false);
        this.img.addEventListener('error', () => {
          this.img = null;
        }, false);
        this.img.src = `https://media.collage.gent/pictograms/${this.imageURL}`
      }
      catch(e) {
        this.img = false;
        console.log("cuaght error", e)
      }
    
  }
  render(ctx) {
    ctx.fillStyle = `rgba(${this.colordata.join(",")})`

    if(highlighted && highlighted.id == this.id) {
      this.hl = true;
    } else {
      this.hl = false;
    }
    if(this.hl) {
      if(!this.img) {
        this.getImage();
      }
      ctx.fillStyle = "rgb(255, 0, 0)" 
    }
    ctx.fillRect(this.x, this.y, 20, 20);


  }
  renderImages(ctx) {

    if(this.img) {
      this.width = this.img.width;
      this.height = this.img.height;
      try {
        ctx.drawImage(this.img, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      } 
      catch(e) {
        console.log("issue")
        this.img = false;
      }
    } else {
      if(this.img !== false) {
        this.getImage()
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