var notes = [
  {
   "begin": "3.529",
   "end": "5.759",
   "id": "001",
   "language": "en",
   "lines": [
    "My arms"
   ]
  },
  {
   "begin": "5.759",
   "end": "9.155",
   "id": "002",
   "language": "en",
   "lines": [
    "I just wanted to hold"
   ]
  },
  {
   "begin": "21.455",
   "end": "25.704",
   "id": "003",
   "language": "en",
   "lines": [
    "Let's conspire to reignite"
   ]
  }
];

var playlist = WaveformPlaylist.init({
  container: document.getElementById("playlist"),
  timescale: true,
  state: 'select',
  samplesPerPixel: 1024,
  colors: {
    waveOutlineColor: '#E0EFF1',
    timeColor: 'grey',
    fadeColor: 'black'
  },
  annotations: notes
});

playlist.load([
  {
    src: "media/audio/Vocals30.mp3"
  }
]).then(function() {
  //can do stuff with the playlist.
});
