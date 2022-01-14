import {context} from './Context.js'
import Waveshaper from './Waveshaper.js'

export default function PingPong(rate) {
  const dlyL = context.createDelay(3);
  const dlyR = context.createDelay(3);
  const highPass = context.createBiquadFilter();
  const highShelf = context.createBiquadFilter();
  const warmth = Waveshaper(30);
  const busGain = context.createGain();
  const wetGain = context.createGain();
  const fb = context.createGain();
  const input = context.createGain();
  const output = context.createGain();
  const split= context.createChannelSplitter(2);
  const merge = context.createChannelMerger(2);

  let timeLeft = dlyL.delayTime;
  let timeRight = dlyR.delayTime;

  input.gain.value = 1;
  output.gain.value = 1;
  fb.gain.value = 0.7;
  wetGain.gain.value = .9;



  highShelf.type = 'highshelf';
  highShelf.frequency.value = 7500;
  highShelf.gain.value = -5;
  highPass.type = 'highpass';
  highPass.frequency.value = 300;
  timeLeft.value = timeRight.value = 0.3;

  if (rate) {
    let dRate = rate / 1000;
    timeLeft.value = timeRight.value = dRate
  } else {
    timeLeft.value = timeRight.value = 0.3;
  }


  function time(t) {
    let dTime = t / 1000;
    timeLeft.exponentialRampToValueAtTime(dTime, context.currentTime + 0.1);
    timeRight.exponentialRampToValueAtTime(dTime, context.currentTime + 0.1);
  }

  function leftTime(t) {
    let dTime = t / 1000;
    timeLeft.exponentialRampToValueAtTime(dTime, context.currentTime + 0.1);
  }

  function rightTime(t) {
    let dTime = t / 1000;
    timeRight.exponentialRampToValueAtTime(dTime, context.currentTime + 0.1);
  }

  function feedback(amt) {
    let fbLev = amt / 10;
    fb.gain.value = fbLev;
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(highPass);
  highPass.connect(split);
  split.connect(wetGain, 0, 0);
  split.connect(wetGain, 1, 0);
  wetGain.connect(dlyL);
  fb.connect(wetGain);
  dlyL.connect(dlyR);
  dlyR.connect(warmth.input);
  warmth.to(highShelf)
  highShelf.connect(fb)
  dlyL.connect(merge, 0, 0);
  dlyR.connect(merge, 0, 1);
  merge.connect(busGain);
  busGain.connect(output);


  return {rightTime, leftTime, time, feedback, input, output, to};
}
