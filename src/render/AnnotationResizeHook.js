import Resizable from 'resizable';
import css from 'mucss';
import { pixelsToSeconds } from '../utils/conversions';

/*
* virtual-dom hook for adding npm resizable package behaviour.
*/
export default class {
  constructor(annotations, samplesPerPixel, sampleRate) {
    this.annotations = annotations;
    this.samplesPerPixel = samplesPerPixel;
    this.sampleRate = sampleRate;
  }

  hook(node) {
    if (!node.classList.contains('draggy-idle')) {
      const resizable = new Resizable(node, {
        within: 'parent',
        handles: 'w,e',
        threshold: 10,
        draggable: false,
        css3: false,
      });

      let annotation = this.annotations.find((el) => {
        return el.id === node.dataset.id;
      });

      const secondsPerPixel = pixelsToSeconds(
        1,
        this.samplesPerPixel,
        this.sampleRate,
      );
       
      resizable.on('resize', function () {
        // resizing to the left
        if (this.draggable.deltaX) {
          const begin = Number(annotation.begin) + (secondsPerPixel * this.draggable.deltaX);
          console.log(begin);
          annotation = Object.assign({}, annotation, {begin});
        }
        else {
          const width = css.parseValue(this.element.style.width);
          const end = Number(annotation.begin) + (secondsPerPixel * width);
          console.log(end);
          annotation = Object.assign({}, annotation, {end});
        }
      });
    }
  }
}
