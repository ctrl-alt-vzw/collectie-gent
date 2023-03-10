
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
    this.scale = window.innerWidth / 2100;
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
        // console.log(event.data);
        const pa = JSON.parse(event.data);
        this.manageNewItem(JSON.parse(event.data));
      }
      catch(e) {
        console.log(e);
      }
    });
    
  }
  manageNewItem(item) {

    if(this.activeItem) {
      console.log(this.activeItem.UUID);
      console.log(item);
      if(this.activeItem.UUID == item.payload.item.UUID) {
        this.activeItem.updatePos(item.payload.x, item.payload.y)
      } else {
        this.collage.unshift(this.activeItem);
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
        //console.log(data)
        data.sort((a, b) => {
          return b.id - a.id
        })
        this.maxY = 0;
        data.forEach((i) => { 
          if(i.y * this.scale > this.maxY) { 
            this.maxY = i.y * this.scale; 
          }
        })
        this.offset = this.maxY - (window.innerHeight/2) - 100;

        data.forEach((item, key) => {
          const i = new Item(item, this.scale, this.offset);
          i.loadImage(this, true);
          this.collage.push(i);
        })
        this.render();
      })

  }
  render() {
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
    canvas.width = window.innerWidth;
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
