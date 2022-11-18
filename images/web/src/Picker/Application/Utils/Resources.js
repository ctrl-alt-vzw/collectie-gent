
import { TextureLoader } from "three";
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();
    //options
    this.setLoaders();
  }
  addResources(sources) {
    console.log(sources)

    
    this.sources = sources;

    this.items = {}
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.startLoading();

  }
  setLoaders () {
    this.loaders = {};
    this.loaders.textureLoader = new TextureLoader();
  }
  startLoading() {
    for(const source of this.sources) {
      this.loaders.textureLoader.load(
        source.imageURI,
        (file, reject) => {
          this.loaders.textureLoader.load(
            source.normalURI,
            (normal, reject) => {
              this.sourceLoaded(source, file, normal)
            }
          )
        }
      )
    }
  }
  sourceLoaded(source, image, normal) {
    this.items[source.UUID] = {
      source: source,
      image: image,
      normal: normal
    };
    this.loaded++;
    if(this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}