import Resizable from 'resizable';

/*
* virtual-dom hook for adding npm resizable package behaviour.
*/
export default class {
  constructor(annotations) {
    this.annotations = annotations;
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
       
      resizable.on('resize', function () {
        console.log(this);
        console.log(this.element.offsetLeft);
      });
    }
  }
}
