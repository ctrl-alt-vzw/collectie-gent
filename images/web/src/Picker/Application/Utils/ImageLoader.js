import * as THREE from "three";
import EventEmitter from "./EventEmitter";
import Image from '../World/Image';

//Currently extending EventEmitter
//TO BE CHECKED
//Maybe in the future implement it like Resources.js

const LOCAL_URL = 'http://localhost:3000';

export default class ImageLoader extends EventEmitter {
    constructor() {
        super();
        this.textureLoader = new THREE.TextureLoader();
        this.getStartingImages();
    }

    async getStartingImages() {
        try {
            const resp = await fetch('https://api.datacratie.cc/annotation/random');
            const randomItems = await resp.json();
            this.loadTextures(randomItems);
        } catch (e) {
            throw Error(e);
        }

    }

    loadTextures(items) {
        items.forEach(item => {
            try {
                this.textureLoader.load(
                    `${LOCAL_URL}/_pictograms/${item.gentImageURI}`,
                    (texture) => {
                        console.log('Texture loaded');
                        const img = new Image(item, texture);
                    },
                    undefined,
                    (e) => {
                        console.error(e);
                        throw new Error('Could not source image locally');
                    }

                );
            } catch {
                console.log('NOT IMPLEMENTED: Switch to external images');
            }
        });
    }
}