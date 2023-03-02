
import React from 'react'
import Tooltip from './../Common/Tooltip'
import Item from './Item.jsx';
const API_URL = process.env.REACT_APP_API_ADDR ? process.env.REACT_APP_API_ADDR : "https://api.collage.gent";
const FILESTORE_URL = process.env.REACT_APP_MEDIA_ADDR ? process.env.REACT_APP_MEDIA_ADDR : "https://media.collage.gent";

const protocol = "https"



export default class CanvasClass extends React.Component {
  constructor(props) {
    super(props)

    this.items = [];
    this.sorted = [];

    this.c = {}

    this.SCALE = 4;
    this.lastScale = 4;
    this.SIZE = 200 * this.SCALE;
    this.RANGE = 1000;
    this.vpx=1
    this.vpy=1
    this.vzl = 1;
    this.svpx = 0;
    this.svpy = 0;
    this.lax = 0;
    this.lay = 0;
    this.svzl = 0;

    this.zax = 0;
    this.zay = 0;


    this.mouseDown = false;
    this.mouseStart = { x: -1, y: -1};
    this.mouseDifference = { x: 0, y: 0 };
    this.ticking = false;
    this.mousewheelMillis = this.millis();
    this.adjustScale = false;
    this.containerWidth = 2000;

    this.highlighted = null;

    this.fetchData();   
  }
  render() {
    return  <>

      <canvas id="pickerContainer"></canvas>
      <script src="index.js" type="module"></script>
      <div id="infoContainer">
        <img src="#" id="infoImage"/>
        <h1 id="infoTitle"></h1>
        <p id="infoParagraph">Duid een item aan om meer te weten te komen</p>
        <button id="selectionBtn">Selecteer</button>
      </div>
      <div id="loading">LOADING</div>
    </>
  }
  componentDidMount() {

    const canvas = document.getElementById('pickerContainer');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')
    this.fetchData(); 


    const innerWidth = window.innerWidth;

    const ratio = innerWidth / this.containerWidth;

    this.SCALE = 4;
    this.lastScale = this.SCALE;
    this.SIZE = 200 * this.CALE;
    this.vpx = 0;
    this.vpy = 0;
    this.lax = window.innerWidth / 2
    this.lay = window.innerHeight / 2;
    this.vzl = 1;

    // check if render is needed
    
    window.addEventListener("wheel", (e) => {
      this.mousewheelMillis = this.millis();
      this.adjustScale = true;
      this.vzl += e.deltaY * -0.01;
      this.vzl = Math.min(Math.max(.1, this.vzl), 10);
      
      this.SCALE = this.vzl;
      this.SIZE = 200 * this.SCALE;
      // RANGE = map(vzl, 0.1, 10, 200, 20);
      this.update();
      e.preventDefault();
    }, {passive:false})
    document.addEventListener("touchstart", (e) => this.mouseDownEvent(e), {passive:false});
    document.addEventListener("touchmove", (e) => this.mouseMoveEvent(e), {passive:false});
    document.addEventListener("touchend", (e) => this.mouseUpEvent(e), {passive:false});
    document.addEventListener("mousedown", (e) => this.mouseDownEvent(e), {passive:false})
    document.addEventListener("mouseup", (e) => this.mouseUpEvent(e), {passive:false})
    document.addEventListener("mousemove", (e) => this.mouseMoveEvent(e), {passive:false})
  }




  mouseMoveEvent(e) {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.adjustPosition(e);
        this.ticking = false;
      });

      this.ticking = true;
    }
  }
  mouseUpEvent(e) {
    e.preventDefault();
    this.mouseDown = false;
    this.vpx = this.vpx + this.svpx;
    this.vpy = this.vpy + this.svpy;

    this.lax = this.lax - this.svpx;
    this.lay = this.lay - this.svpy;
    
    if(Math.abs(this.mouseDifference.x + this.mouseDifference.y) < 10) {
      this.handleClick(this.mousePosition(e))
    }

    this.mouseStart = {x: -1, y:-1};
    this.mouseDifference = { x: 0, y: 0 };
  }
  mouseDownEvent(e) {
    e.preventDefault();
    this.mouseDown = true;
    this.svpx = 0;
    this.svpy = 0;
  }
  handleClick(e) {
    if(e.x > window.innerWidth - 450 && e.y < 450){
      console.log("in square")
    } else {
      const threshold = 20;
      const options = this.items.filter((item) => {
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
        this.highlighted = options[options.length - 1]
        this.renderInformation();
      } else {
        console.log("nothing to select")
      }

    }
      // window.setTimeout(() => render(), 1000)
  }

  renderInformation() {
    const h = this.highlighted;
    if(h) {
        document.getElementById("infoImage").style.display=  `block`;
        document.getElementById("selectionBtn").style.display=  `block`;
    }
    fetch("https://api.collage.gent/annotation/"+h.id)
      .then((r) => r.json())
      .then((data) => {
        document.getElementById("infoTitle").innerHTML=  data[0].originalAnnotation;
        document.getElementById("infoParagraph").innerHTML= `${data[0].collection}:${data[0].originID}`

        document.getElementById("selectionBtn").addEventListener('click', () =>{
            this.props.cutSelected(data[0]);

        })
      })
      .catch((err) => {
        console.error(err)
      })
    document.getElementById("infoImage").src=  `https://media.collage.gent/pictograms/${h.imageURL}`;
    document.getElementById("infoTitle").innerHTML=  "loading";

  }
  fetchData() {
    fetch("https://api.collage.gent/vertexEnriched")
      .then(r => r.json())
      .then((data) => {
        const capture = [];
        data.rows.forEach((item, index) => {
          const c = new Item(item);
          capture.push(c);

          if(index == data.rows.length-1) {
            this.items = capture.sort((a, b) => b.id - a.id);
            this.update();
          }
        })
      })
  }
  adjustPosition(e) {
   if(this.mouseDown) {
      if(this.mouseStart.y < 0 && this.mouseStart.x < 0) { this.mouseStart = this.mousePosition(e) }
      this.mouseDifference.x = this.mousePosition(e).x - this.mouseStart.x;
      this.mouseDifference.y = this.mousePosition(e).y - this.mouseStart.y;

      this.svpx = this.mouseDifference.x;
      this.svpy = this.mouseDifference.y;

      this.update();
    }
  }

  map(number, in_min, in_max, out_min, out_max) {
    return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  update() {
    const canvas = document.getElementById('pickerContainer');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = "red"
    ctx.fillRect(this.lax + this.vpx, this.lay + this.vpy, 10, 10); 


    if(this.adjustScale) {
      if(this.lastScale !== this.SCALE) {
        this.zax = this.map(this.SCALE, 0, 2, canvas.width / 2, -canvas.width / 2);
        this.zay = this.map(this.SCALE, 0, 2, canvas.height / 2, -canvas.height / 2);;
      }
      this.svpx = 0;
      this.svpy = 0;
      this.adjustScale = false;
      this.lastScale = this.SCALE;
      this.items.forEach((item, index) => {
        this.item.updateStats({SIZE: this.SIZE, SCALE: this.SCALE});
      })
    }
    this.c.x = (this.lax+this.vpx);
    this.c.y = (this.lay+this.vpy);
    // only render the ones in view
    this.items.forEach((item) => { 
      if(this.dist(item, this.c) < this.RANGE * this.SCALE) {
        item.inView = true;
        
      } else {
        item.inView = false;
      }
      item.updatePosition({vpx: this.vpx, svpx: this.svpx, SCALE: this.SCALE, zax: this.zax, vpy: this.vpy, svpy: this.svpy, zay: this.zay});      
      item.render(ctx);    
      ctx.fill();
    })   
    this.items.forEach((item) => { 
      if(this.dist(item, this.c) < this.RANGE && this.SCALE > 3) {
        item.renderImages(ctx);
      }
    });
    document.getElementById("loading").style.display = "none"
  }

  dist(a, c) {
    return Math.abs(Math.sqrt(Math.pow(a.x-this.c.x, 2)+Math.pow(a.y-this.c.y, 2)));
  }

  mousePosition(e)
  {
      var posX = e.clientX;
      var posY = e.clientY;
      return { x: posX, y: posY}
  }
  millis() {
    return new Date().getTime();
  }
}
