import * as THREE from 'three';
import {
    VertexNormalsHelper
} from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import data from '../data/out_3D_perplex_50.json';

import Application from '../Application';

const SCALAR = 1;

export default class PointCloud {
    constructor() {
        this.application = new Application();
        this.debug = this.application.debug;
        this.scene = this.application.scene;
        //this.data
        this.geo = new THREE.BufferGeometry();
        this.generate();
        this.draw();
    }

    generate() {
        const colors = [];
        const positions = [];
        const sizes = [];
        const normals = [];

        data.forEach((d, i) => {
            if (!d.vectors) {
                throw Error(`Vectors not defined for item ${d.UUID}`);
            }

            const vector = new THREE.Vector3(d.vectors[0], d.vectors[1], d.vectors[2]);
            vector.addScalar(SCALAR);

            positions.push(vector.x, vector.y, vector.z);

            //calculate color based on distance
            const color = new THREE.Color();
            const dist = vector.distanceTo(new THREE.Vector3(0, 0, 0));

            color.setHSL(dist / 50, 1.0, 0.5);
            colors.push(color.r, color.g, color.b);

            //calculate normal
            vector.normalize();
            normals.push(vector.x, vector.y, vector.z);
        });

        this.geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        this.geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        //this.geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));
        this.geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    }

    draw() {
        const material = new THREE.PointsMaterial({
            // map: spriteMap,
            size: 6,
            // transparent: true,
            // blending: THREE.AdditiveBlending,
            sizeAttenuation: false,
            vertexColors: THREE.VertexColors,
        });
        const mesh = new THREE.Points(this.geo, material);
        this.scene.add(mesh);

        console.log(mesh);

        if (this.debug.active) {
            //Debug points
            const box = new THREE.BoxHelper(mesh, 0xffff00);
            this.scene.add(box);

            const normalsHelper = new VertexNormalsHelper(mesh, 5, 0xff0000);
            this.scene.add(normalsHelper);
        }
    }
}