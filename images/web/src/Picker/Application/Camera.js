import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

import Application from './Application';

const CAMERA = {
  fov: 70,
  near: 1,
  far: 100,
  position: {
    x: 0,
    y: 0,
    z: 20
  }
};

export default class Camera {
  constructor() {
    this.application = new Application();

    this.sizes = this.application.sizes;
    this.scene = this.application.scene;
    this.canvas = this.application.canvas;

    this.enableOrbital = true;

    this.application.debug.ui.add(this, 'enableOrbital');

    this.setInstance();
    this.setControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(CAMERA.fov, this.sizes.width / this.sizes.height, CAMERA.near, CAMERA.far);
    this.instance.position.set(CAMERA.position.x, CAMERA.position.y, CAMERA.position.z);
    this.scene.add(this.instance);
  }
  setControls() {
    if (this.enableOrbital) {
      this.controls = new OrbitControls(this.instance, this.canvas);

      //Controls settings
      this.controls.enableDamping = true;
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.panSpeed = 0.8;
      this.controls.keyPanSpeed = 20;

      this.controls.keys = {
        LEFT: 'ArrowLeft', //left arrow
        UP: 'ArrowUp', // up arrow
        RIGHT: 'ArrowRight', // right arrow
        BOTTOM: 'ArrowDown' // down arrow
      };
    }
  }
  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
  update() {
    if (this.enableOrbital) {
      if (this.controls) {
        this.controls.update();
      } else {
        this.setControls();
      }
    } else {
      this.controls = "";
    }
  }
}