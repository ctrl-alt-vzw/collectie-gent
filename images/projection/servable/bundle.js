(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

class Item {
  constructor(data, scale, offset) {
    this.scale = scale;
    this.offsetY = offset;

    this.imageURL = data.imageURI !== undefined ? data.imageURI : data.imageURL;
    this.height = data.height;
    this.width = data.width;
    this.x = data.x * scale;
    this.y = data.y * scale;

    this.UUID = data.UUID;

    const ratio = this.width / this.height;

    if(ratio < 0) {
      this.width = 200 * ratio * scale;
      this.height = 200  * scale;
    } else {
      this.height = 200 * ratio * scale;
      this.width = 200  * scale;
    }
  }
  updatePos(x, y) {

    this.x = x * this.scale;
    this.y = y * this.scale;

  }
  clicked(mousePos) {
    return mousePos.x > this.x - (this.width / 2) 
      && mousePos.x < this.x + (this.width / 2)
      && mousePos.y > this.y - (this.height/2) - this.offsetY
      && mousePos.y < this.y + (this.height/2) - this.offsetY
  }
  loadImage(app, override = false) {
    try { 
      if(this.y + this.height > this.offsetY || override) {
        this.img = new Image();
        // this.img.setAttribute('crossOrigin', 'Anonymous'); 
        this.img.addEventListener('load', () => {
          if(this.img.height > this.img.width) {
            const r = this.img.height / this.img.width;
            this.width = 200 * this.scale;
            this.height = 200 * r * this.scale;
          } else {
            const r = this.img.width / this.img.height;
            this.width = 200 * r * this.scale;
            this.height = 200 * this.scale;
          }
          // app.render()
        }, false);
        this.img.addEventListener('error', () => {
          this.img = null;
          // this.img.src = `https://media.collage.gent/uploads/800/${this.imageURL}`
        }, false);
        this.img.src = `https://media.collage.gent/uploads/200/${this.imageURL}`;
      }
    }
    catch(e) {
      this.img = false;
      //console.log("caught error", e)
    }
  }
  render(ctx, dragOffset = {x: 0, y: 0}) {
    if(this.img) {
      try {
        ctx.drawImage(this.img, this.x - this.width / 2 + dragOffset.x,  (this.y  - this.height / 2) - this.offsetY+ dragOffset.y, this.width, this.height);
      } 
      catch(e) {
        //console.log("issue", e)
        this.img = false;
      }
    }
  }
}

module.exports = Item;
},{}],2:[function(require,module,exports){

function dist(a, c) {
  return Math.abs(Math.sqrt(Math.pow(a.x-c.x, 2)+Math.pow(a.y-c.y, 2)));
}
function dist3D(a, c) {
  return Math.abs(Math.sqrt(Math.pow(a.bx-c.bx, 2)+Math.pow(a.by-c.by, 2)+Math.pow(a.bz-c.bz, 2)));
}
function mousePosition(e) {
    var posX = e.clientX;
    var posY = e.clientY;
    return { x: posX, y: posY}
}

function millis() {
  return new Date().getTime();
}

function mapValues(number, in_min, in_max, out_min, out_max) {
  return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

module.exports =  {
  dist,
  dist3D,
  mousePosition,
  millis,
  mapValues
}
},{}],3:[function(require,module,exports){

const  {
  dist,
  dist3D,
  mousePosition,
  millis,
  mapValues: map
} = require('./helpers.js')

const  Item = require('./Item.js')

const maxXDrag = 100;



class View {
  constructor() {
    this.renderHTML();
    console.log(document.getElementById("canvasContainer"))
    this.scale = document.getElementById("canvasContainer").clientWidth / 2100;
    console.log(this.scale)
    this.collage = [];

    this.fetchData();
    
    this.draggedOffset = { x:50, y: 0}

    this.activeItem = null;


    // Create WebSocket connection.
    this.socket = new WebSocket("wss://socket.collage.gent");
    // Connection opened
    this.socket.addEventListener('open', (event) => {
      console.log("opened");
        this.socket.send("ping");
    });

    // Listen for messages
    this.socket.addEventListener('message', (event) => {
      try {
        if(event.data !== "pong" ) {
          console.log(event.data);
          const pa = JSON.parse(event.data);
          this.manageNewItem(JSON.parse(event.data));
        }
      }
      catch(e) {
        console.log(e);
      }
    });


    setInterval(() => this.renderClippings(), 1000)
    
  }
  manageNewItem(item) {

    if(this.activeItem) {
      if(this.activeItem.UUID == item.payload.item.UUID) {
        this.activeItem.updatePos(item.payload.x, item.payload.y)
      } else {
        this.collage.unshift(this.activeItem);

        this.maxY = 0;
        this.collage.forEach((i) => { 
          if(i.y * this.scale > this.maxY) { 
            this.maxY = i.y * this.scale; 
          }
        })
        this.offset = this.maxY - (document.getElementById("canvasContainer").innerHeight/2) - 100;

        const i = new Item(item.payload.item, this.scale, this.offset);
        i.loadImage(this, true);
        this.activeItem = i;
      }
    } else {
      const i = new Item(item.payload.item, this.scale, this.offset);
      i.loadImage(this, true);
      this.activeItem = i;
    }

    this.render();


  }
  fetchData() {
    fetch("https://api.collage.gent/clipping")
      .then((r) => r.json())
      .then((data) => {
        console.log(data)
        data.sort((a, b) => {
          return b.id - a.id
        })
        this.maxY = 0;
        data.forEach((i) => { 
          if(i.y * this.scale > this.maxY) { 
            this.maxY = i.y * this.scale; 
          }
        })
        this.offset = this.maxY - (document.getElementById("canvasContainer").clientHeight/2) - 100;

        data.forEach((item, key) => {
          const i = new Item(item, this.scale, this.offset);
          i.loadImage(this, true);
          this.collage.push(i);
        })
        this.renderClippings();
      })

  }
  renderClippings() {
    const canvas = document.getElementById('viewCanvas');
    const ctx = canvas.getContext("2d");
        
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(this.activeItem) {
      this.activeItem.render(ctx, this.draggedOffset);
    }
    this.collage.forEach((clipping, key) => {
      clipping.render(ctx, this.draggedOffset);
    })
  }
  renderHTML() {
    this.componentDidMount()
  }
  componentDidMount( ) {
    const canvas = document.getElementById('viewCanvas');
    canvas.style.display = "block";
    canvas.width = document.getElementById("canvasContainer").clientWidth + 50;
    canvas.height = window.innerHeight;

  }
  cleanup() {
    const oldCanvas = document.getElementById("viewCanvas");
    const newCanvas = oldCanvas.cloneNode(true);
    oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
    document.getElementById("headerContainer").innerHTML = ``;
    document.getElementById("viewCanvas").style.display = 'none';
  }
}

module.exports = View;

},{"./Item.js":1,"./helpers.js":2}],4:[function(require,module,exports){

const View  = require('./js/view.js');




window.addEventListener('DOMContentLoaded', (event) => {
  console.log("loaded")
  render();
});

function render() {
  const viewer = new View(); 
}

},{"./js/view.js":3}]},{},[4]);
