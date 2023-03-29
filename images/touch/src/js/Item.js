
class Item {
  constructor(data, scale, offset) {
    this.scale = scale;
    this.offsetY = offset;

    this.imageURL = data.imageURI;
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
            const r = this.img.width / this.img.height;
            this.width = 200 * r * this.scale;
            this.height = 200 * this.scale;
          } else {
            const r = this.img.height / this.img.width;
            this.width = 200  * this.scale;
            this.height = 200 * r * this.scale;
          }
          app.render()
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