import * as THREE from 'three';

import Application from '../Application';

export default class Raycaster {
    constructor() {
        this.application = new Application();
        this.renderer = this.application.renderer;
        this.camera = this.application.camera;
        this.scene = this.application.scene;

        this.imageMeshes = this.application.imageMeshes;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.initEvent();
    }

    initEvent() {
        window.addEventListener('mousedown', e => {
            e.preventDefault();
            this.mouse.x = (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.imageMeshes);

            if (intersects.length > 0) {
                console.error("Collision!", intersects);
                intersects[0].object.onClick();
            }
        });
    }
}