import moment from 'moment';
import 'moment-duration-format';
import h from 'virtual-dom/h';
import EventEmitter from 'event-emitter';

import Annotation from './Annotation';
import aeneas from './builder/aeneas';
import { pixelsToSeconds, secondsToPixels } from '../utils/conversions';
import ShiftInteraction from '../interaction/ShiftInteraction';

export default class {
  constructor(playlist, annotations, ee = EventEmitter()) {
    this.playlist = playlist;
    this.annotations = annotations.map((a) => {
      let note = aeneas(a);
      note.leftShift = new ShiftInteraction(playlist, ee, note, {direction: 'left'});
      note.rightShift = new ShiftInteraction(playlist, ee, note, {direction: 'right'});
      
      return note;
    });
    this.ee = this.setupEE(ee);
    this.isContinuousPlay = false;
  }

  setupEE(ee) {
    ee.on('shift', (deltaTime, note, data) => {
      console.log(deltaTime);
      console.log(note);
      console.log(data);

      // resizing to the left
      if (data.direction === 'left') {
        note.start += deltaTime;
        
        // if (annotationIndex && (annotations[annotationIndex - 1].end > begin)) {
        //   const leftNeighbour = annotations[annotationIndex - 1];
        //   annotations[annotationIndex - 1] = Object.assign({}, leftNeighbour, {end: begin});
        // }
      }
      // resizing to the right
      else {
        note.end += deltaTime;
        
        // if (annotationIndex < (annotations.length - 1) && (annotations[annotationIndex + 1].begin < end)) {
        //   const rightNeighbour = annotations[annotationIndex + 1];
        //   annotations[annotationIndex + 1] = Object.assign({}, rightNeighbour, {begin: end});
        // }
      }

      this.playlist.drawRequest();
    });

    return ee;
  }

  renderResizeLeft(note) {
    const events = ShiftInteraction.getEvents();
    let config = {attributes: {
      style: 'position: absolute; height: 30px; width: 10px; top: 0; left: -2px',
    }};

    events.forEach((event) => {
      config[`on${event}`] = note.leftShift[event].bind(note.leftShift);
    });

    return h('div.resize-handle.resize-w', config);
  }

  renderResizeRight(note) {
    const events = ShiftInteraction.getEvents();
    let config = {attributes: {
      style: 'position: absolute; height: 30px; width: 10px; top: 0; right: -2px',
    }};

    events.forEach((event) => {
      config[`on${event}`] = note.rightShift[event].bind(note.rightShift);
    });

    return h('div.resize-handle.resize-e', config);
  }

  render() {
    const boxes = h('div.annotations-boxes',
      {
        attributes: {
          style: `height: 30px;`,
        },
      },
      this.annotations.map((note, i) => {
        const samplesPerPixel = this.playlist.samplesPerPixel;
        const sampleRate = this.playlist.sampleRate;
        const pixPerSec = sampleRate / samplesPerPixel;
        const pixOffset = secondsToPixels(this.playlist.scrollLeft, samplesPerPixel, sampleRate);
        const secondsPerPixel = pixelsToSeconds(
          1,
          samplesPerPixel,
          sampleRate,
        );

        const left = Math.floor((note.start * pixPerSec) - pixOffset);
        const width = Math.ceil((note.end * pixPerSec) - (note.start * pixPerSec));

        return h('div.annotation-box',
          {
            attributes: {
              style: `position: absolute; height: 30px; width: ${width}px; left: ${left}px`,
              'data-id': note.id,
            },
            onclick: (e) => {
              if (this.isContinuousPlay) {
                this.playlist.ee.emit('play', this.annotations[i].start);
              } else {
                this.playlist.ee.emit('play', this.annotations[i].start, this.annotations[i].end);
              }
            },
          },
          [
            this.renderResizeLeft(note),
            h('span.id', [
              note.id,
            ]),
            this.renderResizeRight(note),
          ],
        );
      })
    );

    const boxesWrapper = h('div.annotations-boxes-wrapper',
      {
        attributes: {
          style: 'overflow: hidden;',
        }
      },
      [
        boxes,
      ],
    );

    const text = h('div.annotations-text',
      this.annotations.map((note) => {
        const start = moment.duration(note.start, 'seconds')
          .format(this.playlist.durationFormat, {trim: false});

        const end = moment.duration(note.end, 'seconds')
          .format(this.playlist.durationFormat, {trim: false});


        let segmentClass = '';
        if (this.playlist.isPlaying() &&
          (this.playlist.playbackSeconds >= note.start) &&
          (this.playlist.playbackSeconds <= note.end)) {
          segmentClass = 'current';
        }

        return h(`div.row.${segmentClass}`,
          [
            h('span.annotation.id', [
              note.id,
            ]),
            h('span.annotation.text', [
              note.lines,
            ]),
            h('span.annotation.start', [
              start,
            ]),
            h('span.annotation.end', [
              end,
            ]),
          ],
        );
      })
    );

    return h('div.annotations',
      [
        boxesWrapper,
        text,
      ],
    );
  }
}
