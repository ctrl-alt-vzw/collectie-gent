
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
    this.scale = document.getElementById("canvasContainer").clientWidth / 1100;
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
