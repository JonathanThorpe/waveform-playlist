var notes = [
  {
   "begin": "5.759",
   "end": "9.155",
   "id": "f000001",
   "language": "en",
   "lines": [
    "I just wanted to hold"
   ]
  },
  {
   "begin": "21.455",
   "end": "25.704",
   "id": "f000002",
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
  samplesPerPixel: 512,
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
