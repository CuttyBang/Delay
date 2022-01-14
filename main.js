import './style.scss'

import { context, OUTPUT } from './components/Context.js'
import { voice } from './components/audio/voice.js'
import { createSource } from './components/Source.js'
import { stereoLayout, bbLayout, digiLayout, tapeLayout } from './components/configurations/Layouts.js'
import Gain from './components/Gain.js'
import Delay from './components/Delay.js'
import PingPong from './components/DoubleDelay.js'
import BBDelay from './components/BBDelay.js'
import Digi from './components/DigiDelay.js'
import Dynamics from './components/Dynamics.js'

const plate = document.getElementById('plate');
const layout = document.getElementById('layoutsWrapper');
const bucket = document.getElementById('BBD');
const ping = document.getElementById('Stereo');
const ana = document.getElementById('Tape');
const digi = document.getElementById('Digital');
const startButton = document.getElementById('startButton');
const mixKnob = document.getElementById('mixKnob');
const volKnob = document.getElementById('volKnob');
plate.style.background = 'url("./images/tape_plate.png")';
layout.innerHTML = tapeLayout;
let isPlaying = false;
let currentDelay = false;
tapeControls();

const dryGain = context.createGain();
const wetGain = context.createGain();
const sourceGain = context.createGain();
const fanIn = Gain(10);
const outputGain = Gain(3);
const tapeDelay = Delay(300);
const digiDelay = Digi(250);
const bbDelay = BBDelay(400);
const pingPong = PingPong(500);
const dynamics = Dynamics();

function tapeControls() {
  document.getElementById('timeKnob').addEventListener('input', function() {
    tapeDelay.time(this.value);
  })
  document.getElementById('fbKnob').addEventListener('input', function() {
    tapeDelay.feedback(this.value);
  })
  document.getElementById('warmthKnob').addEventListener('input', function() {
    tapeDelay.warmth(this.value);
  })
  document.getElementById('diffusionKnob').addEventListener('input', function() {
    tapeDelay.diffusion(this.value);
  })
}

function pingPongControls() {
  document.getElementById('timeKnob').addEventListener('input', function() {
    pingPong.time(this.value);
  });
  document.getElementById('leftTimeKnob').addEventListener('input', function() {
    pingPong.leftTime(this.value);
  });
  document.getElementById('rightTimeKnob').addEventListener('input', function() {
    pingPong.rightTime(this.value);
  });
  document.getElementById('fbKnob').addEventListener('input', function() {
    pingPong.feedback(this.value);
  });
  document.getElementById('widthSlider').addEventListener('input', function() {
    pingPong.width(this.value);
  });
}

function bbdControls() {
  document.getElementById('timeKnob').addEventListener('input', function() {
    bbDelay.time(this.value);
  });
  document.getElementById('fbKnob').addEventListener('input', function() {
    bbDelay.feedback(fb.value);
  });
  document.getElementById('widthKnob').addEventListener('input', function() {
   bbDelay.width(this.value);
 });
  document.getElementById('chorusKnob').addEventListener('input', function() {
    bbDelay.chorus(this.value);
  });
}

function digiControls() {
  document.getElementById('timeKnob').addEventListener('input', function() {
    digiDelay.time(this.value);
  });
  document.getElementById('fbKnob').addEventListener('input', function() {
    digiDelay.feedback(this.value);
  });
  document.getElementById('colorSlider').addEventListener('input', function() {
    digiDelay.color(this.value);
  });
  document.getElementById('widthKnob').addEventListener('input', function() {
   digiDelay.width(this.value);
 });
  document.getElementById('bitKnob').addEventListener('input', function() {
    digiDelay.bitcrush(this.value);
  });
}

function crossfade(a, b, value) {
  let v = value/100;
  let gain1 = Math.cos(v * 0.5*Math.PI);
  let gain2 = Math.cos((1.0-v) * 0.5*Math.PI);
  a.gain.setValueAtTime(gain1, context.currentTime);
  b.gain.setValueAtTime(gain2, context.currentTime);
}

sourceGain.connect(tapeDelay.input);
tapeDelay.to(fanIn);
pingPong.to(fanIn);
bbDelay.to(fanIn);
digiDelay.to(fanIn);
fanIn.to(wetGain);
wetGain.connect(dynamics.input);
dryGain.connect(dynamics.input);
dynamics.to(outputGain);
outputGain.to(OUTPUT);


function init() {
  const source = createSource(voice);
  const sourceAudio = source.audioSource;
  source.to(sourceGain);
  source.to(dryGain);
  sourceAudio.start();
  isPlaying = true;

  const stopButton = document.getElementById('stopButton');
  stopButton.onclick = function() {
    sourceAudio.stop();
    isPlaying = false;
  };
}

if (isPlaying) {
  startButton.disabled = true;
} else {
  startButton.disabled = false;
}

startButton.addEventListener('click', () => {
  if (isPlaying) { return } else { init() };
});

mixKnob.addEventListener('input', function() {
  crossfade(dryGain, wetGain, mixKnob.value);
});

volKnob.addEventListener('input', function() {
  outputGain.value(volKnob.value);
});

ana.addEventListener('click', () => {
  plate.style.background = 'url("./images/tape_plate.png")';
  layout.innerHTML = tapeLayout;
  tapeControls();
  sourceGain.disconnect();
  sourceGain.connect(tapeDelay.input);
});

bucket.addEventListener('click', () => {
  plate.style.background = 'url("./images/bbd_plate.png")';
  layout.innerHTML = bbLayout;
  bbdControls();
  sourceGain.disconnect();
  sourceGain.connect(bbDelay.input);;
});

ping.addEventListener('click', () => {
  plate.style.background = 'url("./images/stereo_plate.png")';
  layout.innerHTML = stereoLayout;
  pingPongControls();
  sourceGain.disconnect();
  sourceGain.connect(pingPong.input);
});

digi.addEventListener('click', () => {
  plate.style.background = 'url("./images/digi_plate.png")';
  layout.innerHTML = digiLayout;
  digiControls();
  sourceGain.disconnect();
  sourceGain.connect(digiDelay.input);
});
