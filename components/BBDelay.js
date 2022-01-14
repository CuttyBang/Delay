import {context} from './Context.js'
import Waveshaper from './Waveshaper.js'
import Chorus from './Chorus.js'

export default function BBDelay(rate) {
  const delay = context.createDelay(0.6);
  const highPass = context.createBiquadFilter();
  const highShelf = context.createBiquadFilter();
  const lowPass = context.createBiquadFilter();
  const offset = context.createDelay(2);
  const split = context.createChannelSplitter(2);
  const merge = context.createChannelMerger(2);
  const spread = context.createDelay(0.04);
  const warmth = Waveshaper(10);
  const chrs = Chorus();
  const fb = context.createGain();
  const mergeBus = context.createGain();
  const input = context.createGain();
  const output = context.createGain();

  input.gain.value = 1;
  output.gain.value = 1;
  warmth.output.gain.value = 0.3;
  warmth.drive.value = 0.8;
  spread.delayTime.value = 0;
  fb.gain.value = 0.7;

  if (rate) {
    if (rate > 600) {
      delay.delayTime.value = 0.6;
    } else {
      let dRate = rate / 1000;
      delay.delayTime.value = dRate
    }
  } else {
    delay.delayTime.value = 0.3;
  }

  highShelf.type = 'highshelf';
  highShelf.frequency.value = 8000;
  highShelf.gain.value = -5;
  highPass.type = 'highpass';
  highPass.frequency.value = 200;
  lowPass.type = 'lowpass';
  lowPass.frequency.value = 5000;

  function time(t) {
    let dTime = t / 1000;
    delay.delayTime.exponentialRampToValueAtTime(dTime, 0.1);
  }

  function feedback(amt) {
    let fbLev = amt / 10;
    fb.gain.value = fbLev;
  }
chrs.wet.gain.value = 0;
  function chorus(c) {
    let gain1 = Math.cos(c * 0.5*Math.PI);
    let gain2 = Math.cos((1.0-c) * 0.5*Math.PI);
    chrs.dry.gain.setValueAtTime(gain1, context.currentTime);
    chrs.wet.gain.setValueAtTime(gain2, context.currentTime);
  }

  function width(w) {
    if (w > 20) {
      spread.delayTime.value = 0.020;
    } else {
      let wVal = w / 1000;
      spread.delayTime.value = wVal;
    }
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(highPass);
  highPass.connect(highShelf);
  highShelf.connect(delay);
  delay.connect(fb);
  fb.connect(delay);
  delay.connect(lowPass);
  lowPass.connect(split);
  split.connect(spread);
  split.connect(merge, 0, 1);
  spread.connect(merge, 0, 0);
  merge.connect(chrs.input);
  chrs.to(output);

  return { delay, fb, input, output, chorus, width, time, feedback, to };
}
