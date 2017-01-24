import Resizable from 'resizable';
import css from 'mucss';
import { pixelsToSeconds } from '../utils/conversions';

const resizableMap = new WeakMap();

/*
* virtual-dom hook for adding npm resizable package behaviour.
*/
export default class {
  constructor(playlist, left) {
    this.annotations = playlist.annotations;
    this.samplesPerPixel = playlist.samplesPerPixel;
    this.sampleRate = playlist.sampleRate;
    this.left = left;
  }

  hook(node) {
    if (!node.classList.contains('draggy-idle')) {

      const resizable = new Resizable(node, {
        within: 'parent',
        handles: 'w,e',
        threshold: 1,
        draggable: false
      });

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

          if (annotationIndex && (hook.annotations[annotationIndex - 1].end > begin)) {
            const leftNeighbour = hook.annotations[annotationIndex - 1];
            hook.annotations[annotationIndex - 1] = Object.assign({}, leftNeighbour, {end: begin});
          }
        }
        // resizing to the right
        else {
          const width = css.parseValue(this.element.style.width);
          const end = Number(annotation.begin) + (secondsPerPixel * width);
          hook.annotations[annotationIndex] = Object.assign({}, annotation, {end});

          if (annotationIndex < (hook.annotations.length - 1) && (hook.annotations[annotationIndex + 1].begin < end)) {
            const rightNeighbour = hook.annotations[annotationIndex + 1];
            hook.annotations[annotationIndex + 1] = Object.assign({}, rightNeighbour, {begin: end});
          }
        }

        playlist.draw(playlist.render());
      });

      resizableMap.set(node, resizable);
      resizable.draggable.move(this.left);
    } else {
      const resizable = resizableMap.get(node);
      resizable.draggable.move(this.left);
    }
  }
}
