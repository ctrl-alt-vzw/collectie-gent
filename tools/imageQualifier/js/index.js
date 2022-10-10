

const app = {
  db: [],
  count: 10000,
  init() {
    fetch("https://api.datacratie.cc/annotation")
      .then(r => r.json())
      .then((db) => {
        this.db = db;
        this.drawCanvas(this.db[0])
      })
  },

  drawCanvas(data) {

    if(data.imagedata == {} || data.imagedata == null) {
      const el = document.createElement("canvas");
      var img = document.createElement("img");

      img.addEventListener("load", () => {

          // Dynamically create a canvas element
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          img.crossOrigin="anonymous"
          // Actual resizing
          const original = {
            width: document.getElementById(data.UUID).width,
            height: document.getElementById(data.UUID).height 
          }
          original.ratio = original.width / original.height;
          console.log(original)

          ctx.drawImage(img, 0, 0, 2 * original.ratio, 2);
          const id = {
            tl: Array.from(ctx.getImageData(0, 0, 1, 1).data),
            tr: Array.from(ctx.getImageData(1, 0, 1, 1).data),
            bl: Array.from(ctx.getImageData(0, 1, 1, 1).data),
            br: Array.from(ctx.getImageData(1, 1, 1, 1).data)
          }
          if(id.tl.join("") === "0000"
            && id.tr.join("") === "0000"
            && id.bl.join("") === "0000"
            && id.br.join("") === "0000") {
            console.log("no")
          } else {
            const toStore = {
              ...original,
              colors: id
            }
            this.store(data, toStore)
          }

      });
      img.src = data.gentImageURI;
      img.id=data.UUID 
      document.getElementById("container").insertAdjacentElement("beforeEnd", img)
    } else {
      console.log("contains", data.imagedata)
        this.db.shift()
        if(this.db.length > 0) {
          this.drawCanvas(this.db[0])
        }

    }

  },
  store(anno, data) {
    fetch("https://api.datacratie.cc/annotation/"+anno.UUID+"/imagedata", {
        method: "PATCH",
        body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          },
    })
    .then(r => r.json())
    .then((data) => {
        console.log(data)

        document.getElementById("container").innerHTML = "";

        this.db.shift()
        if(this.db.length > 0) {
          this.drawCanvas(this.db[0])
        }
    })
  }
}

app.init();
