import { secondsToPixels } from '../utils/conversions';

/*
* virtual-dom hook for scrolling the track container.
*/
export default class {
  constructor(playlist) {
    this.playlist = playlist;
  }

  hook(node) {
    const el = node;
    el.scrollLeft = secondsToPixels(
        this.playlist.scrollLeft,
        this.playlist.samplesPerPixel,
        this.playlist.sampleRate
    );
  }
}
