/*
* virtual-dom hook for scrolling to the text annotation.
*/
class ScrollTopHook {
  hook(node) {
    const el = node.querySelector('.current');
    if (el) {
      const box = node.getBoundingClientRect();
      const row = el.getBoundingClientRect();
      const diff = row.top - box.top;
      node.scrollTop += diff;
    }
  }
}

export default ScrollTopHook;
