import moment from 'moment';
import 'moment-duration-format';
import h from 'virtual-dom/h';
import EventEmitter from 'event-emitter';

import Annotation from './Annotation';
import aeneas from './builder/aeneas';
import { pixelsToSeconds, secondsToPixels } from '../utils/conversions';

export default class {
  constructor(playlist, ee = EventEmitter()) {
    this.playlist = playlist;
    this.annotations = playlist.annotations.map((a) => {
      return aeneas(a);
    });
    this.ee = ee;
    this.isContinuousPlay = false;
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
            h('div.resize-handle.resize-w', {attributes: {
              style: 'position: absolute; height: 30px; width: 10px; top: 0; left: -2px',
            }}),
            h('span.id', [
              note.id,
            ]),
            h('div.resize-handle.resize-e', {attributes: {
              style: 'position: absolute; height: 30px; width: 10px; top: 0; right: -2px',
            }}),
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
          .format(this.durationFormat, {trim: false});

        const end = moment.duration(note.end, 'seconds')
          .format(this.durationFormat, {trim: false});


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
