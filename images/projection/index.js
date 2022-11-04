// import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

// const socket = io("ws://localhost:3004")

// socket.on("ping", (arg)=> {
//   console.log(arg)
//   socket.emit("pong", {})
// });

const clippings = [];

let SCALE = 1;
let SIZE = 200 * SCALE;



function init() {

  const innerWidth = window.innerWidth;

  const ratio = innerWidth / 2000;
  SCALE = ratio;
  SIZE = 200 * SCALE;


  document.addEventListener('scroll', (event) => {
    const scrollPos = window.scrollY;
  });


  fetch("https://api.datacratie.cc/clipping")
    .then(r => r.json())
    .then((data) => {
      console.log(data)

      data.forEach((item, index) => {
        const c = new Clipping(item);
        clippings.push(c);
      })

      render();
    })
}

function render() {
  const container = document.getElementById("container");
  clippings.forEach((item, index) => {
    container.innerHTML += item.render();
  })
}

init();


class Clipping {
  constructor(data) {
    this.id = data.UUID;
    if(data.height > data.width) {
      this.ratio = data.width / data.height;
      this.height = SIZE;
      this.width = SIZE * this.ratio;
    } else {
      this.ratio = data.height / data.width;
      this.height = SIZE * this.ratio;
      this.width = SIZE;

    }
    this.x = data.x * SCALE;
    this.y = data.y * SCALE;
    this.image = data.imageURI.replace("/800/", "/50/");


  }
  render() {
    return `
      <div class="clipping" id="${this.id}" style="top: ${this.y}px; left: ${this.x}px; width: ${this.width}px; height: ${this.height}px">
        <img src="${this.image}" />
      </div>
    `

  }
}