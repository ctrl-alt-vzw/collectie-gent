const Pick  = require("./pick.js");
const Cut = require("./cut.js");
const Place = require('./place.js');
const View  = require('./view.js');

const states = {
  PICK: 0,
  CUT: 1,
  PLACE: 2,
  VIEW: 3
}

console.log("Render");
window.addEventListener('DOMContentLoaded', (event) => {
  render();
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
function render() {
  const state = sessionStorage.getItem("STATE")

  if(state == states.PICK) {
    console.log("new")
    const picker = new Pick(selectionDone);
  } 
  else if(state == states.CUT) {
    const selection = JSON.parse(sessionStorage.getItem("selection"))
    const cutter = new Cut(selection,cutDone);
  }
  else if(state == states.PLACE) {
    const selection = JSON.parse(sessionStorage.getItem("cut"))
    const placer = new Place(selection,placingDone);
  }
  else if(state == states.VIEW) {
    const selection = JSON.parse(sessionStorage.getItem("placed"))
    const viewer = new View(selection, startSelection);
  }
  else {
    const def = new Pick(selectionDone);
  } 
}


// let data = sessionStorage.getItem("key");
// sessionStorage.removeItem("key");
// sessionStorage.clear();