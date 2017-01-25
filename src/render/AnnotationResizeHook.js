import css from 'mucss';
import { pixelsToSeconds, secondsToPixels } from '../utils/conversions';

/*
* virtual-dom hook for adding npm resizable package behaviour.
*/
export default class {
  constructor(playlist, note) {
    this.playlist = playlist;
    this.note = note
  }

  hook(node, prop, prev) {
    

    //css(node, {width});

    const annotationIndex = this.playlist.annotations.findIndex((el) => {
      return el.id === node.dataset.id;
    });

    const annotations = this.playlist.annotations;
       
      // resizable.on('resize', function () {
      //   const annotation = annotations[annotationIndex];
      //   // resizing to the left
      //   if (this.draggable.deltaX) {
      //     const begin = Number(annotation.begin) + (secondsPerPixel * this.draggable.deltaX);
      //     annotations[annotationIndex] = Object.assign({}, annotation, {begin});

      //     if (annotationIndex && (annotations[annotationIndex - 1].end > begin)) {
      //       const leftNeighbour = annotations[annotationIndex - 1];
      //       annotations[annotationIndex - 1] = Object.assign({}, leftNeighbour, {end: begin});
      //     }
      //   }
      //   // resizing to the right
      //   else {
      //     const width = css.parseValue(this.element.style.width);
      //     const end = Number(annotation.begin) + (secondsPerPixel * width);
      //     annotations[annotationIndex] = Object.assign({}, annotation, {end});

      //     if (annotationIndex < (annotations.length - 1) && (annotations[annotationIndex + 1].begin < end)) {
      //       const rightNeighbour = annotations[annotationIndex + 1];
      //       annotations[annotationIndex + 1] = Object.assign({}, rightNeighbour, {begin: end});
      //     }
      //   }

      //   playlist.draw(playlist.render());
      // });

      // resizableMap.set(node, resizable);
      // resizable.draggable.within = 'parent';
      // resizable.draggable.move(left);
    // } else {
    //   const resizable = resizableMap.get(node);
    //   resizable.draggable.move(left);
    // }
  }
}
