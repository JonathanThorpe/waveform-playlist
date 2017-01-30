import { pixelsToSeconds } from '../utils/conversions';

export default class {
  constructor(playlist, ee, obj = null, data = {}) {
    this.playlist = playlist;
    this.ee = ee;
    this.obj = obj;
    this.data = data;
    this.active = false;
  }

  emitShift(x) {
    const deltaX = x - this.prevX;

    // emit shift event if not 0
    if (deltaX) {
      const deltaTime = pixelsToSeconds(deltaX, this.playlist.samplesPerPixel, this.playlist.sampleRate);
      this.prevX = x;
      this.ee.emit('shift', deltaTime, this.obj, this.data);
    }
  }

  complete(x) {
    this.emitShift(x);
    this.active = false;
  }

  mousedown(e) {
    e.preventDefault();

    this.active = true;
    this.el = e.target;
    this.prevX = e.offsetX;
  }

  mousemove(e) {
    if (this.active) {
      e.preventDefault();
      this.emitShift(e.offsetX);
    }
  }

  mouseup(e) {
    if (this.active) {
      e.preventDefault();
      this.complete(e.offsetX);
    }
  }

  mouseleave(e) {
    if (this.active) {
      e.preventDefault();
      this.complete(e.offsetX);
    }
  }

  static getClass() {
    return '.shift';
  }

  static getEvents() {
    return ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];
  }
}
