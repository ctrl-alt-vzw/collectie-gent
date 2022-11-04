import * as THREE from 'three'
import Application from "../Application";

const LIGHTS = {
  posPointLight: {
    x: 0,
    y: 100,
    z: 0
  }
};

export default class Light {
  constructor() {
    this.application = new Application();
    this.debug = this.application.debug;
    this.scene = this.application.scene;
    this.setAmbientLight();
    this.setPointLight();
  }
  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0x404040, 10); // soft white light
    this.scene.add(this.ambientLight);
  }
  setPointLight() {
    this.pointLight = new THREE.PointLight();
    this.pointLight.position.set(LIGHTS.posPointLight.x, LIGHTS.posPointLight.y, LIGHTS.posPointLight.z);
    //add light
    this.scene.add(this.pointLight);
    //add helper
    if (this.debug.active) {
      this.scene.add(new THREE.PointLightHelper(this.pointLight, 15));
    }
  }

}