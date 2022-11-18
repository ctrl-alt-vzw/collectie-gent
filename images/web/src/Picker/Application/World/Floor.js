/* import * as THREE from 'three'
import Application from "../Application";


export default class Floor {
  constructor() {
    this.application = new Application();
    this.scene = this.application.scene;
    
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }  
  setGeometry(){
    this.geometry = new THREE.PlaneGeometry(100, 100);
  }
  setMaterial(){
    this.material = new THREE.MeshPhongMaterial({ color: "#FFF"})
  }
  setMesh(){
    this.mesh = new THREE.Mesh(
      this.geometry,
      this.material
    )
    this.mesh.position.set(0, 0, -5);
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh)

  }

} */