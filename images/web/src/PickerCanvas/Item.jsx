
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
    // this.updateStats();
    this.inView = false;
    this.colordata = data.colordata.colors[0];


  }
  updatePosition(sup) {
    // if(inView && !this.img) {
      // console.log("loading")
      // this.getImage();
    // }
    this.x = (this.bx + sup.vpx + sup.svpx) * sup.SCALE + sup.zax;
    this.y = (this.by + sup.vpy + sup.svpy) * sup.SCALE + sup.zay;
  }
  updateStats(sup) {
    console.log(sup)
    if(this.h > this.w) {
      this.ratio = this.w / this.h;
      this.height = sup.SIZE;
      this.width = sup.SIZE * this.ratio;
    } else {
      this.ratio = this.h / this.w;
      this.height = sup.SIZE * this.ratio;
      this.width = sup.SIZE;
    }
    if(this.x + this.width > 0 && this.x < window.innerWidth && this.y + this.height > 0 && this.y < window.innerHeight) {
      this.getImage(sup.SCALE);
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

export default Item;