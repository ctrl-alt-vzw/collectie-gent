
import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    // setup
    this.start = Date.now();
    this.current = this.start;
    this.ellapsed = 0;
    this.delta = 16;
    window.requestAnimationFrame(() => this.tick())

  }
  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.ellapsed = this.current - this.start;
    this.trigger('tick')
    window.requestAnimationFrame(() => this.tick())
  }
}