/* import * as THREE from 'three'
import Application from "../Application";
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import EventEmitter from '../Utils/EventEmitter';

export default class Element extends EventEmitter{
  constructor(clipping, index) {
    super(); 
    this.application = new Application();
    this.scene = this.application.scene;

    this.index = index;
    this.source = clipping.source;
    this.map = clipping.image;
    this.normal = clipping.normal;
    this.draw();
  }
  draw() {
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.source.width/100, this.source.height/100),
      new THREE.MeshPhongMaterial({ 
        map: this.map,
        color: "white",
        transparent: true,
        alphaMap: this.normal
      })
    )
    this.mesh.castShadow = true;
    this.mesh.rotation.set(.1, 0, 0);
    this.mesh.position.set(this.source.x, this.source.y, 0.1 * this.index)
    this.scene.add(this.mesh)
  }
} */