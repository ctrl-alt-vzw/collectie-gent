const {
  dist,
  dist3D,
  mousePosition,
  touchPosition,
  millis,
  mapValues: map
} = require('./helpers.js')
const  vertices = require('./data/vertex2D.js')


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

let touchDown = false;
let touchStart = { x: -1, y: -1};
let touchDifference = { x: 0, y: 0 };
let touchLastPosition = { x: 0, y: 0 };


let ticking = false;

let mousewheelMillis = millis();
let adjustScale = false;
let containerWidth = 2000;

let highlighted = null;

const baseInfoBox = `
    <p id="loaded"></p> 
    <img src="#" id="infoImage"/>
    <h1 id="AIInfoTitle"></h1>
    <h1 id="infoTitle"></h1>
    <p id="firstInfo"><i>Hier kan je alle items terugvinden die de digitale collecties bevatten. Door te slepen kan je heen en weer bewegen, door op een item te drukken krijg je meer informatie en kan je deze selecteren om toe te voegen aan de collage door de zwarte knop.</i></p>
    <p id="infoParagraph">Duid een item aan om meer te weten te komen</p>
    <button id="selectionBtn">Selecteer</button>
`

let numImagesLoading = 0;
 class Pick {
  constructor(selectionEvent, panic) {
    this.selectionDone = selectionEvent;
    this.renderHTML()
    this.init()
    this.panic = panic;

  }
  
  init() {
    const canvas = document.getElementById('pickCanvas');
    document.getElementById("selectionBtn").addEventListener('click', e => this.clickHandler(e))
    // document.getElementById("selectionBtn").addEventListener('touchstart', e => this.clickHandler(e))

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    this.initMovements();
    

    if(items.length == 0) { 
      if(document.getElementById("loading")) {
        document.getElementById("loading").style.display = "block"
      }  
      this.fetchData(); 

      setTimeout(() => {
        this.render()
      }, 1000) 
       
    } else {
      if(document.getElementById("loading")) {
        document.getElementById("loading").style.display = "none"
      }
    }



    this.setScale(6);

  }
  setScale(scle) {

      adjustScale = true;
      vzl = scle;
      
      SCALE = vzl;
      SIZE = 200 * SCALE;
      
      items.forEach((item, index) => {
        item.updateStats();
      })
      this.render();


  }
  initMovements() {

    const innerWidth = window.innerWidth;

    const ratio = innerWidth / containerWidth;
    vpx = 0;
    vpy = 0;
    
    svpx = Math.round(Math.random() * 1000) - 500;
    svpy = Math.round(Math.random() * 1000) - 500;
    
    lax = window.innerWidth / 2
    lay = window.innerHeight / 2;
    vzl = 1;

    vpx = vpx + svpx;
    vpy = vpy + svpy;

    lax = lax - svpx;
    lay = lay - svpy;
      
	  

    document.getElementById("pickCanvas").addEventListener("touchstart", (e) => this.touchDownEvent(e));
    document.getElementById("pickCanvas").addEventListener("touchmove", (e) => this.touchMoveEvent(e));
    document.getElementById("pickCanvas").addEventListener("touchend", (e) => this.touchUpEvent(e));

    document.getElementById("pickCanvas").addEventListener("mousedown", (e) => this.mouseDownEvent(e))
    document.getElementById("pickCanvas").addEventListener("mouseup", (e) => this.mouseUpEvent(e))
    document.getElementById("pickCanvas").addEventListener("mousemove", (e) => this.mouseMoveEvent(e))
  }

  touchMoveEvent(e) {
    touchLastPosition = touchPosition(e);
    console.log('moving', touchLastPosition, ticking)
      window.requestAnimationFrame(() => {
        console.log("adjusting")
        this.adjustPosition(e);
      });
  }
  touchUpEvent(e) {
    const mp = touchLastPosition;
    const c = document.getElementById("infoContainer");
    const rect = c.getBoundingClientRect();

    if(mp.x > rect.left && mp.y < rect.bottom) { 
      console.log('over overlay')
    } else {
       
      e.preventDefault();
      touchDown = false;
      vpx = vpx + svpx;
      vpy = vpy + svpy;

      lax = lax - svpx;
      lay = lay - svpy;
      
      if(Math.abs(touchDifference.x + touchDifference.y) < 10) {
        console.log('isClick')
        this.handleClick(mp)
      }
      touchStart = {x: -1, y:-1};
      touchDifference = { x: 0, y: 0 };
 
    }
  }
  touchDownEvent(e) {
    console.log('down', touchPosition(e))

    const mp = touchPosition(e);
    const c = document.getElementById("infoContainer");
    const rect = c.getBoundingClientRect();



    if(mp.x > rect.left && mp.y < rect.bottom) { 
    } else {
      e.preventDefault();
      touchDown = true;
      svpx = 0;
      svpy = 0;
 
      touchLastPosition = touchPosition(e);
      this.adjustPosition(e);
    
    }
  }

  mouseMoveEvent(e) {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        this.adjustPosition(e);
        ticking = false;
      });

      ticking = true;
    }
  }
  mouseUpEvent(e) {

    const mp = mousePosition(e);
    const c = document.getElementById("infoContainer");
    const rect = c.getBoundingClientRect();

    if(mp.x > rect.left && mp.y < rect.bottom) { 

    } else {
       
      e.preventDefault();
      mouseDown = false;
      vpx = vpx + svpx;
      vpy = vpy + svpy;

      lax = lax - svpx;
      lay = lay - svpy;
      
      if(Math.abs(mouseDifference.x + mouseDifference.y) < 10) {
        this.handleClick(mousePosition(e))
      }

      mouseStart = {x: -1, y:-1};
      mouseDifference = { x: 0, y: 0 };
 
    }
  }
  mouseDownEvent(e) {
    const mp = mousePosition(e);
    const c = document.getElementById("infoContainer");
    const rect = c.getBoundingClientRect();

    if(mp.x > rect.left && mp.y < rect.bottom) { 
    } else {
      e.preventDefault();
      mouseDown = true;
      svpx = 0;
      svpy = 0;
 
    }
  }

  handleClick(e) {
    if(highlighted) {
      console.log("used to be ", highlighted)
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
      console.log(options)
      highlighted = options[options.length - 1]
      this.renderInformation(highlighted);
    } else {
      console.log("nothing to select")
      document.getElementById("infoContainer").innerHTML = baseInfoBox;  
    }
    this.render();

    // window.setTimeout(() => render(), 1000)
  }

  renderInformation(h) {
    document.getElementById("firstInfo").style.display = 'none';    
    if(h) {
        document.getElementById("infoImage").style.display= `block`;
        document.getElementById("selectionBtn").style.display=  `block`;
    }
    fetch("https://api.collage.gent/annotation/"+h.id)
      .then((r) => r.json())
      .then((data) => {
        document.getElementById("infoTitle").innerHTML=  data[0].originalAnnotation;
        document.getElementById("AIInfoTitle").innerHTML=  `<mark>${data[0].annotation}</mark>`;
        document.getElementById("infoParagraph").innerHTML= `collectie: ${data[0].collection}<br />ID:${data[0].originID}`
      })
      .catch((err) => {
        console.error(err)
      })
    const image = `https://media.collage.gent/pictograms/${h.imageURL}`;
    document.getElementById("infoImage").src= image;
    
    const highRes = new Image();
    highRes.src = `https://api.collectie.gent/iiif/imageiiif/3/${h.imageURL}/full/^1000,/0/default.jpg`
    highRes.onload = function() {
      console.log("loaded")
      document.getElementById("infoImage").src= highRes.src;

    }
  }

  clickHandler(e) {
    console.log("clicked")
    e.preventDefault()

    let h = highlighted;
    this.cleanup();

    console.log(h)
    this.selectionDone(h)
  }

  fetchData() {
    if(items.length > 0) {
      this.render();
    } else {
    // fetch("https://api.collage.gent/vertexEnriched")
    // fetch("./data/vertex.json")
    //   .then(r => r.json())
    //   .then((data) => {

      console.log(vertices)

        const data = vertices;
        const capture = [];
        data.forEach((item, index) => {
          const c = new Item(item);
          capture.push(c);

          if(index == data.length-1) {
            items = capture.sort((a, b) => b.sortID - a.sortID);
            sorted = items;
            
            this.render();
          }

        })
        if(document.getElementById("loading")) {
          document.getElementById("loading").style.display = "none"
        }
      // })


    }
  }
  adjustPosition(e) {
    if(mouseDown) {
      const scalar = 0.15;
      if(mouseStart.y < 0 && mouseStart.x < 0) { mouseStart = mousePosition(e) }
      mouseDifference.x = mousePosition(e).x - mouseStart.x;
      mouseDifference.y = mousePosition(e).y - mouseStart.y;

      svpx = mouseDifference.x * scalar;
      svpy = mouseDifference.y * scalar;

      this.render();
    }
    if(touchDown) {
      const tp = touchPosition(e);
      console.log('handling touch move'. tp)
      const scalar = 0.15;
      if(touchStart.y < 0 && touchStart.x < 0) { touchStart = tp }
      touchDifference.x = tp.x - touchStart.x;
      touchDifference.y = tp.y - touchStart.y;

      svpx = touchDifference.x * scalar;
      svpy = touchDifference.y * scalar;

      this.render();
    }
  }
  render() {
    const canvas = document.getElementById('pickCanvas');

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // document.getElementById("loaded").innerHTML = numImagesLoading;

    // ctx.beginPath();
    // ctx.fillStyle = "red"
    // ctx.fillRect(lax + vpx, lay + vpy, 10, 10); 


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

  renderHTML() {
    // document.getElementById("canvasContainer").insertAdjacentHTML("beforeend", `<div id="loading">LOADING</div>`)
    document.getElementById("infoContainer").innerHTML = baseInfoBox;  
    document.getElementById("infoContainer").style.display = "block";
    document.getElementById("pickCanvas").style.display = "block";

  }
  cleanup() {
    highlighted = null;
    const canvas = document.getElementById('pickCanvas');
    canvas.style.display = 'none';

    document.getElementById("infoContainer").style.display = "none";
    document.getElementById("infoContainer").innerHTML = "";


    c = {}

    SCALE = 1;
    lastScale = 1;
    SIZE = 200 * SCALE;
    RANGE = 1000;


    vpx,vpy = 0
    svpx = 0;
    svpy = 0;
    lax = 0;
    lay = 0;
    svzl = 0;

    zax = 0;
    zay = 0;


    mouseDown = false;
    mouseStart = { x: -1, y: -1};
    mouseDifference = { x: 0, y: 0 };

    touchDown = false;
    touchStart = { x: -1, y: -1};
    touchDifference = { x: 0, y: 0 };
    touchLastPosition = { x: 0, y: 0 };


    ticking = false;
    mousewheelMillis = millis();
    adjustScale = false;
    containerWidth = 2000;

    highlighted = null;
  }
}

class Item {
  constructor(data) {
    this.received = data;
    this.vertexID = data.UUID;
    this.id = data.annotationUUID;
    this.annotation = data.annotation;
    this.bx = data.x * 50;
    this.by = data.y * 50;
    this.w = data.width;
    this.h = data.height;
    this.imageURL = data.gentImageURI;

    this.img = null;

    this.curZoomLevel = 0;
    // this.getImage();
    this.updateStats();
    this.inView = false;
    this.colordata = JSON.parse(data.colordata).colors[0];


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
      this.getImage();
    }
  }
  getImage() {
      try { 
        if(numImagesLoading < 600) {
          this.img = new Image();   // Create new img element
          numImagesLoading += 1;
          this.img.addEventListener('load', () => {
            numImagesLoading -= 1;
          }, false);
          this.img.addEventListener('error', () => {
            this.img = "#";
          }, false);
          this.img.src = `https://media.collage.gent/pictograms/${this.imageURL}`
        }
      }
      catch(e) {
        this.img = false;
        //console.log("cuaght error", e)
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
        //console.log("issue")
        this.img = false;
      }
    } else {
      if(this.img !== false) {
        this.getImage()
      }
    }
  }
}


module.exports = Pick;
