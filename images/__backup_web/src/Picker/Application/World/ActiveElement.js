/* import * as THREE from 'three'
import Application from "../Application";
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import Element from './Element';


export default class ActiveElement extends Element {

  constructor(clipping, index) {
    super(clipping, index);

    this.setControls();
  }
  setControls() {
    this.controls = new DragControls( [this.mesh], this.application.camera.instance, this.application.canvas );
    this.controls.addEventListener( 'drag', ( event ) => {
      this.mesh.translateZ(-event.object.position.z + 0.1 * this.index)
    } );
    this.controls.addEventListener( 'dragend', ( event ) => {
    } );
    
  }
  storePosition() {
    console.log(this.mesh.position)
    fetch("https://api.collage.gent/clipping/"+this.source.UUID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        x: this.mesh.position.x,
        y: this.mesh.position.y
      })
    })
      .then(r => r.json())
      .then((data) => {
        console.log(data)
      })
 
  }
} */