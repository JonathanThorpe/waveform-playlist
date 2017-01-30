import moment from 'moment';
import 'moment-duration-format';
import h from 'virtual-dom/h';
import EventEmitter from 'event-emitter';

import Annotation from './Annotation';
import aeneas from './builder/aeneas';
import { pixelsToSeconds, secondsToPixels } from '../utils/conversions';
import DragInteraction from '../interaction/DragInteraction';
import ScrollTopHook from './render/ScrollTopHook';

export default class {
  constructor(playlist, annotations) {
    this.playlist = playlist;
    this.annotations = annotations.map((a, i) => {
      let note = aeneas(a);
      note.leftShift = new DragInteraction(playlist, note, {
        direction: 'left',
        index: i,
      });
      note.rightShift = new DragInteraction(playlist, note, {
        direction: 'right',
        index: i,
      });
      
      return note;
    });
    this.setupEE(playlist.ee);
    this.isContinuousPlay = false;
  }

  setupEE(ee) {
    ee.on('dragged', (deltaTime, note, data) => {
      const annotationIndex = data.index;
      const annotations = this.annotations;

      // resizing to the left
      if (data.direction === 'left') {
        note.start += deltaTime;

        if (note.start < 0) {
          note.start = 0;
        }
        
        if (annotationIndex && (annotations[annotationIndex - 1].end > note.start)) {
          annotations[annotationIndex - 1].end = note.start;
        }
      }
      // resizing to the right
      else {
        note.end += deltaTime;

        if (note.end > this.playlist.duration) {
          note.end = this.playlist.duration;
        }
        
        if (annotationIndex < (annotations.length - 1) && (annotations[annotationIndex + 1].start < note.end)) {
          annotations[annotationIndex + 1].start = note.end;
        }
      }

      this.playlist.drawRequest();
    });

    ee.on('continuousplay', (val) => {
      this.isContinuousPlay = val;
    });

    return ee;
  }

  renderResizeLeft(note) {
    const events = DragInteraction.getEvents();
    let config = {attributes: {
      style: 'position: absolute; height: 30px; width: 10px; top: 0; left: -2px',
      draggable: true,
    }};

    events.forEach((event) => {
      config[`on${event}`] = note.leftShift[event].bind(note.leftShift);
    });

    return h('div.resize-handle.resize-w', config);
  }

  renderResizeRight(note) {
    const events = DragInteraction.getEvents();
    let config = {attributes: {
      style: 'position: absolute; height: 30px; width: 10px; top: 0; right: -2px',
      draggable: true,
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
          },
          [
            this.renderResizeLeft(note),
            h('span.id',
              {
                onclick: (e) => {
                  if (this.isContinuousPlay) {
                    this.playlist.ee.emit('play', this.annotations[i].start);
                  } else {
                    this.playlist.ee.emit('play', this.annotations[i].start, this.annotations[i].end);
                  }
                },
              },
              [
                note.id,
              ]
            ),
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
      {
        hook: new ScrollTopHook(),
      },
      this.annotations.map((note) => {
        const start = moment.duration(note.start, 'seconds')
          .format(this.playlist.durationFormat, {trim: false});

        const end = moment.duration(note.end, 'seconds')
          .format(this.playlist.durationFormat, {trim: false});


        let segmentClass = '';
        if (this.playlist.isPlaying() &&
          (this.playlist.playbackSeconds >= note.start) &&
          (this.playlist.playbackSeconds <= note.end)) {
          segmentClass = '.current';
        }

        return h(`div.row${segmentClass}`,
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
