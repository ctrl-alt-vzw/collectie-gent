import * as THREE from 'three';
import Application from "../Application.js";
import ImageLoader from '../Utils/ImageLoader.js';
import Light from './Light.js';
import PointCloud from './PointCloud.js';


export default class World {
  constructor() {
    this.application = new Application();
    this.scene = this.application.scene;
    this.resources = this.application.resources;

    this.lights = new Light();
    this.pointCloud = new PointCloud();
    this.imageLoader = new ImageLoader();

    /*
    const gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080);
    gridHelper.position.y = -150;
    gridHelper.position.x = -150;
    this.scene.add(gridHelper);

    const polarGridHelper = new THREE.PolarGridHelper(200, 16, 8, 64, 0x0000ff, 0x808080);
    polarGridHelper.position.y = -150;
    polarGridHelper.position.x = 200;
    this.scene.add(polarGridHelper);
    */
  }

}