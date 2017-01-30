import { pixelsToSeconds } from '../utils/conversions';

export default class {
  constructor(playlist, ee, obj = null, data = {}) {
    this.playlist = playlist;
    this.ee = ee;
    this.obj = obj;
    this.data = data;
    this.active = false;

    this.ondragover = (e) => {
      if (this.active) {
        e.preventDefault();
        this.emitShift(e.clientX);
      }
    };
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

  complete() {
    this.active = false;
    document.removeEventListener('dragover', this.ondragover);
  }

  dragstart(e) {
    this.active = true;
    this.el = e.target;
    this.prevX = e.clientX;

    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    document.addEventListener('dragover', this.ondragover);
  }

  dragend(e) {
    if (this.active) {
      e.preventDefault();
      this.complete();
    }
  }

  static getClass() {
    return '.shift';
  }

  static getEvents() {
    return ['dragstart', 'dragend'];
  }
}
