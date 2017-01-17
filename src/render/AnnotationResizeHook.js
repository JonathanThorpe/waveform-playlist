import Resizable from 'resizable';
import css from 'mucss';
import { pixelsToSeconds } from '../utils/conversions';

const resizableMap = new WeakMap();

/*
* virtual-dom hook for adding npm resizable package behaviour.
*/
export default class {
  constructor(playlist, left, width) {
    this.annotations = playlist.annotations;
    this.samplesPerPixel = playlist.samplesPerPixel;
    this.sampleRate = playlist.sampleRate;
    this.left = left;
    this.width = width;
  }

  init(node) {
    if (!node.classList.contains('draggy-idle')) {
      // only set the calculated width on first render.
      // Otherwise let the resizable take care of this.
      css(node, {
        width: `${this.width}px`,
      });

      const resizable = new Resizable(node, {
        within: 'parent',
        handles: 'w,e',
        threshold: 1,
        draggable: false
      });

      resizable.draggable.move(this.left);

      const annotationIndex = this.annotations.findIndex((el) => {
        return el.id === node.dataset.id;
      });

      const secondsPerPixel = pixelsToSeconds(
        1,
        this.samplesPerPixel,
        this.sampleRate,
      );

      const hook = this;
       
      resizable.on('resize', function () {
        const annotation = hook.annotations[annotationIndex];
        // resizing to the left
        if (this.draggable.deltaX) {
          const begin = Number(annotation.begin) + (secondsPerPixel * this.draggable.deltaX);
          hook.annotations[annotationIndex] = Object.assign({}, annotation, {begin});
        }
        else {
          const width = css.parseValue(this.element.style.width);
          const end = Number(annotation.begin) + (secondsPerPixel * width);
          hook.annotations[annotationIndex] = Object.assign({}, annotation, {end});
        }

        playlist.draw(playlist.render());
      });

      resizableMap.set(node, resizable);
    } else {
      window.requestAnimationFrame(() => {
        const resizable = resizableMap.get(node);
        resizable.draggable.move(this.left);
      });
    }
  }

  hook(node) {
    // timeout is used so resizeable isn't called before node is rendered.
    // no better workaround with hooks currently in virtual-dom.
    setTimeout(() => {
      this.init(node);
    }, 0);
  }
}
