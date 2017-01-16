import Resizable from 'resizable';

/*
* virtual-dom hook for adding npm resizable package behaviour.
*/
export default class {
  constructor(annotations) {
    this.annotations = annotations;
  }

  hook(node) {
    var resizable = new Resizable(node, {
      within: 'parent',
      handles: 'w,e',
      threshold: 10,
      draggable: false,
      css3: false,
    });
     
    resizable.on('resize', () => {
      const data = node.target.dataset;
    });
  }
}
