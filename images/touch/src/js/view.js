
const  {
  dist,
  dist3D,
  mousePosition,
  touchPosition,
  millis,
  mapValues: map
} = require('./helpers.js')

const  Item = require('./Item.js')

const maxXDrag = 100;

class View {
  constructor(selected, CTACB) {
    this.renderHTML();
    this.scale = window.innerWidth / 1000;
    this.collage = [];
    this.fetchData();

    this.ctaCallBack = CTACB;

    this.draggedOffset = {x: 0, y:0}
    
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

    this.collage.forEach((clipping, key) => {
      clipping.render(ctx, this.draggedOffset);
    })
  }
  renderHTML() {
    document.getElementById("headerContainer").innerHTML = `
      <button id="CTABtn">Voeg zelf een toe</button>
    `;

    this.componentDidMount()
  }
  componentDidMount( ) {
    const canvas = document.getElementById('viewCanvas');
    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.getElementById('viewCanvas').addEventListener("touchstart", (e) => this.touchDownEvent(e), {passive:false});
    document.getElementById('viewCanvas').addEventListener("touchmove", (e) => this.touchMoveEvent(e), {passive:false});
    document.getElementById('viewCanvas').addEventListener("touchend", (e) => this.touchUpEvent(e), {passive:false});

    document.getElementById('viewCanvas').addEventListener("mousedown", (e) => this.mouseDownEvent(e))
    document.getElementById('viewCanvas').addEventListener("mouseup", (e) => this.mouseUpEvent(e))
    document.getElementById('viewCanvas').addEventListener("mousemove", (e) => this.mouseMoveEvent(e))

    document.getElementById("CTABtn").addEventListener("click", (e) => {
      e.preventDefault()
      this.cleanup()

      this.ctaCallBack()
    })
  }
  cleanup() {
    const oldCanvas = document.getElementById("viewCanvas");
    const newCanvas = oldCanvas.cloneNode(true);
    oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
    document.getElementById("headerContainer").innerHTML = ``;
    document.getElementById("viewCanvas").style.display = 'none';
  }

  mouseMoveEvent(e) {
    if(this.dragging) {      
      const mousePos = mousePosition(e);
      const scalar = 1;
      this.draggedOffset.x -= (this.lastMousePosition.x - mousePos.x) * scalar;
      this.draggedOffset.y -= (this.lastMousePosition.y - mousePos.y) * scalar;

      if(this.draggedOffset.x < -maxXDrag) { this.draggedOffset.x = -maxXDrag;}
      if(this.draggedOffset.x > maxXDrag) { this.draggedOffset.x = maxXDrag;}

      
      this.lastMousePosition = mousePos;
      this.render();
    }
  }
  mouseDownEvent(e) {
    const mousePos = mousePosition(e);
    this.lastMousePosition = mousePos;
    this.dragging = true;
  }
  mouseUpEvent(e) {
    this.dragging = false;

  }
  touchMoveEvent(e) {
    if(this.dragging) {      
      const touchPos = touchPosition(e);
      const scalar = 1;
      this.draggedOffset.x -= (this.lastMousePosition.x - touchPos.x) * scalar;
      this.draggedOffset.y -= (this.lastMousePosition.y - touchPos.y) * scalar;

      if(this.draggedOffset.x < -maxXDrag) { this.draggedOffset.x = -maxXDrag;}
      if(this.draggedOffset.x > maxXDrag) { this.draggedOffset.x = maxXDrag;}

      
      this.lastMousePosition = touchPos;
      this.render();
    }
  }
  touchDownEvent(e) {
    const touchPos = touchPosition(e);
    this.lastMousePosition = touchPos;
    this.dragging = true;
  }
  touchUpEvent(e) {
    this.dragging = false;

  }
}

module.exports = View;
