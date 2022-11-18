import * as THREE from 'three';

import Application from "../Application";

//Temporary load data; in the future fetch or include in original fetch
import data from '../data/out_3D_perplex_50.json';

const IMAGE = {
    size: 10
}

export default class Image {
    constructor(item, texture) {
        this.application = new Application();
        this.scene = this.application.scene;
        this.camera = this.application.camera;
        this.imageMeshes = this.application.imageMeshes;

        //How to index the loaded images?
        this.draw(item, texture);
    }

    draw(item, texture) {
        const vector = this.getVector(item.UUID);
        const aspect = texture.image.width / texture.image.height;

        const material = new THREE.MeshLambertMaterial({
            map: texture
        });

        //TODO switch ratio
        const geo = new THREE.PlaneGeometry(IMAGE.size * aspect, IMAGE.size);
        const mesh = new THREE.Mesh(geo, material);

        const position = new THREE.Vector3(vector[0], vector[1], vector[2]);
        mesh.position.copy(position);

        const angle = position.angleTo(new THREE.Vector3(0, 0, 0));
        mesh.rotation.y = Math.PI;


        //lookAway
        const lookVector = new THREE.Vector3();
        lookVector.subVectors(position, new THREE.Vector3(0, 0, 0)).add(position);
        mesh.lookAt(lookVector);

        //callback
        mesh.onClick = () => {
            this.onClick(mesh)
        }

        //add
        this.imageMeshes.push(mesh);
        this.scene.add(mesh);
    }

    getVector(UUID) {
        const itemWithCoords = data.find(item => {
            return item.UUID == UUID;
        });

        if (itemWithCoords && itemWithCoords.hasOwnProperty('vectors')) {
            return itemWithCoords.vectors;
        } else {
            throw Error(`Item ${UUID} not included in data model aka NO VECTORS PROVIDED`);
        }
    }

    onClick(mesh) {
        console.log('Clicked on me', this, mesh);
        this.camera.lookAt(mesh, 10);
        this.application.selectedCallback(mesh.uuid)
    }
}