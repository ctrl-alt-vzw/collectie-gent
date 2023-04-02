
const  {
  dist,
  dist3D,
  mousePosition,
  touchPosition,
  millis,
  mapValues: map,
  logToServer: log
} = require('./helpers.js')

const  Item = require('./Item.js')



// Create WebSocket connection.



class Place {
  constructor(selected, placedCB) {
    this.renderHTML();
    this.scale = window.innerWidth / 1300;
    this.collage = [];
    this.fetchData();
    this.maxY = 0;
    this.itemToDrop = null;
    this.dragging = false;
    this.selected = selected;
    this.placedCallback = placedCB;
    this.socket = new WebSocket("wss://socket.collage.gent");
    // Connection opened
    this.socket.addEventListener('open', (event) => {
      console.log("opened");
      log("place: socket opened");
    });

    log("place: entered");
    document.getElementById("instructionContainer").style.display = "block";
    document.getElementById("instructionContainer").innerText = `Sleep je selectie op de juiste plaats bij de collage en druk op de knop onderaan het scherm.

    Hierna zal de printer je toevoeging afprinten. 
    scheur de sticker af door deze naar linksboven te trekken.
    `
  }
  fetchData() {
    fetch("https://api.collage.gent/clipping")
      .then((r) => r.json())
      .then((data) => {
        //console.log(data)
        data.sort((a, b) => {
          return b.id - a.id
        })
        data.forEach((i) => { if(i.y * this.scale > this.maxY) { this.maxY = i.y * this.scale; }})
        this.offset = this.maxY - ((window.innerHeight / 2));

        //console.log(this.offset)
        data.forEach((item, key) => {
          const i = new Item(item, this.scale, this.offset);
          i.loadImage(this);
          this.collage.push(i);
        })
        this.itemToDrop = new Item(this.selected, this.scale, this.offset)
        this.itemToDrop.x = (window.innerWidth / 2);
        this.itemToDrop.y = (window.innerHeight/2 + 100) + this.offset;

        //console.log(this.itemToDrop.x, this.itemToDrop.y)

        //console.log(this.itemToDrop)
        this.itemToDrop.loadImage(this, true);
        this.render();
      })

  }
  render() {
    const canvas = document.getElementById('placeCanvas');
    const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.collage.forEach((clipping, key) => {
      clipping.render(ctx);
    })
    this.itemToDrop.render(ctx);
  }
  renderHTML() {

    document.getElementById("headerContainer").innerHTML = `
        <button id="saveBtn">Hier staat ie goed</button>
    `;
    this.componentDidMount()
  }
  componentDidMount( ) {
    const canvas = document.getElementById('placeCanvas');
    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.getElementById('placeCanvas').addEventListener("touchstart", (e) => this.touchDownEvent(e), false);
    document.getElementById('placeCanvas').addEventListener("touchmove", (e) => this.touchMoveEvent(e), false);
    document.getElementById('placeCanvas').addEventListener("touchend", (e) => this.touchUpEvent(e), false);

    document.getElementById('placeCanvas').addEventListener("mousedown", (e) => this.mouseDownEvent(e), {passive:false})
    document.getElementById('placeCanvas').addEventListener("mouseup", (e) => this.mouseUpEvent(e), {passive:false})
    document.getElementById('placeCanvas').addEventListener("mousemove", (e) => this.mouseMoveEvent(e), {passive:false})

    document.getElementById("saveBtn").addEventListener("click", (e) => {
      e.preventDefault()
      this.cleanup();
      this.save();
    })
  }
  cleanup() {
    const oldCanvas = document.getElementById('placeCanvas');
    oldCanvas.style.display = "none";
    const newCanvas = oldCanvas.cloneNode(true);
    oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);

  }
  save() {
    //console.log(this.itemToDrop.UUID);
    fetch(`https://api.collage.gent/clipping/${this.itemToDrop.UUID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        x: this.itemToDrop.x / this.scale,
        y: this.itemToDrop.y / this.scale
      })
    })
      .then(r => r.json())
      .then((data) => {
        log("place: saved and exited "+this.itemToDrop.UUID);
        //console.log(data)
        this.collage = [];

        this.placedCallback(data);
      })

  }
  mouseMoveEvent(e) {
    if(this.itemToDrop && this.dragging) {
      this.itemToDrop.x = mousePosition(e).x
      this.itemToDrop.y = mousePosition(e).y + this.offset

      this.socket.send(JSON.stringify({
        type: "itemMove",
        payload: {
          item: this.itemToDrop,
          x: this.itemToDrop.x / this.scale,
          y: this.itemToDrop.y / this.scale
        }
      }))

      this.render();
    }
  }
  mouseDownEvent(e) {
    document.getElementById("instructionContainer").style.display = "none";
    const mousePos = mousePosition(e);
    if(this.itemToDrop.clicked(mousePos)) {
      this.dragging = true;
    }
  }
  mouseUpEvent(e) {
    this.dragging = false
  }
  touchMoveEvent(e) {
    if(this.itemToDrop && this.dragging) {
      this.itemToDrop.x = touchPosition(e).x
      this.itemToDrop.y = touchPosition(e).y + this.offset

      this.socket.send(JSON.stringify({
        type: "itemMove",
        payload: {
          item: this.itemToDrop,
          x: this.itemToDrop.x / this.scale,
          y: this.itemToDrop.y / this.scale
        }
      }))

      this.render();
    }
  }
  touchDownEvent(e) {

    document.getElementById("instructionContainer").style.display = "none";

    const touchPos = touchPosition(e);
    if(this.itemToDrop.clicked(touchPos)) {
      this.dragging = true;
    }
  }
  touchUpEvent(e) {
    this.dragging = false
  }
}

module.exports = Place;
