const Pick  = require("./js/pick.js");
const Cut = require("./js/cut.js");
const Place = require('./js/place.js');
const View  = require('./js/view.js');


let countDown = setTimeout(() => {
  console.log("restart");   
  panic();
}, 1000 * 60 * 5);

const states = {
  PICK: 0,
  CUT: 1,
  PLACE: 2,
  VIEW: 3
}

console.log("Render");
window.addEventListener('DOMContentLoaded', (event) => {
  render();
  document.getElementById("panicBtn").addEventListener('click', () => panic())


  document.getElementById("canvasContainer").addEventListener("click", (e) => {
    console.log("touched")
    clearTimeout(countDown)

    countDown = setTimeout(() => {
      console.log("restart");
      panic();
    }, 1000 * 60 * 5);

  })
});

function selectionDone(selection) {
  console.log("saving selection", selection)
  sessionStorage.setItem("selection", JSON.stringify(selection));
  sessionStorage.setItem("STATE", states.CUT);
  render();
}
function cutDone(result) {
  console.log("cutting done", result);
  sessionStorage.setItem("cut", JSON.stringify(result));
  sessionStorage.setItem("STATE", states.PLACE);
  render()
}
function placingDone(result) {
    location.reload();
  console.log("placing done", result);
  sessionStorage.setItem("placed", JSON.stringify(result));
  sessionStorage.setItem("STATE", states.VIEW);
  render()
}
function startSelection() {
  sessionStorage.setItem("selection", "");
  sessionStorage.setItem("cut", "");
  sessionStorage.setItem("placed", "");
  sessionStorage.setItem("STATE", states.PICK);
  render();
}


function panic() {
  sessionStorage.setItem("selection", "");
  sessionStorage.setItem("cut", "");
  sessionStorage.setItem("placed", "");
  sessionStorage.setItem("STATE", states.PICK);
  window.location.reload();
}
function render() {
  const state = sessionStorage.getItem("STATE")

  if(state == states.PICK) {
    console.log("new")
    const picker = new Pick(selectionDone, panic);
  } 
  else if(state == states.CUT) {
    const selection = JSON.parse(sessionStorage.getItem("selection"))
    const cutter = new Cut(selection,cutDone, panic);
  }
  else if(state == states.PLACE) {
    const selection = JSON.parse(sessionStorage.getItem("cut"))
    const placer = new Place(selection,placingDone, panic);
  }
  else if(state == states.VIEW) {
    const selection = JSON.parse(sessionStorage.getItem("placed"))
    const viewer = new View(selection, startSelection, panic);
  }
  else {
    const def = new Pick(selectionDone, panic);
  } 
}


// let data = sessionStorage.getItem("key");
// sessionStorage.removeItem("key");
// sessionStorage.clear();