import {context} from './Context.js'
import Waveshaper from './Waveshaper.js'

export default function DoubleDelay(rate) {
  const dlyL = context.createDelay(2);
  const dlyR = context.createDelay(2);
  const warmthL = Waveshaper(30);
  const warmthR = Waveshaper(30);
  const highShelfL = context.createBiquadFilter();
  const highShelfR = context.createBiquadFilter();
  const highPass = context.createBiquadFilter();
  const fbL = context.createGain();
  const fbR = context.createGain();
  const busGain = context.createGain();
  const wetGain = context.createGain();
  const input = context.createGain();
  const output = context.createGain();
  const split= context.createChannelSplitter(2);
  const merge = context.createChannelMerger(2);

  let timeLeft = dlyL.delayTime;
  let timeRight = dlyR.delayTime;

  input.gain.value = 1;
  output.gain.value = 1;
  fbL.gain.value = fbL.gain.value = 0.7;
  wetGain.gain.value = 1;
  busGain.gain.value = 0.9;
  warmthL.output.gain.value = 0.8;
  warmthR.output.gain.value = 0.8;
  warmthL.drive.value = 0.1;
  warmthR.drive.value = 0.1;

  highShelfL.type = 'highshelf';
  highShelfL.frequency.value = 7500;
  highShelfL.gain.value = -5;
  highShelfR.type = 'highshelf';
  highShelfR.frequency.value = 7500;
  highShelfR.gain.value = -5;
  highPass.type = 'highpass';
  highPass.frequency.value = 250;
  timeLeft.value = 0.5;
  timeRight.value = 0.25;

  if (rate) {
    let dRateL = rate / 1000;
    let dRateR = dRateL / 2;
    timeLeft.value = dRateL;
    timeRight.value = dRateR;
  } else {
    timeLeft.value = 0.5;
    timeRight.value = 0.25;
  }

  function time(t) {
    let dTimeL = t / 1000;
    let dTimeR = dRateL / 2;
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
    fbL.gain.value = fbLev;
    fbR.gain.value = fbLev;
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(wetGain);
  wetGain.connect(highPass);
  highPass.connect(split);
  split.connect(dlyL, 0, 0);
  split.connect(dlyR, 1, 0);
  dlyL.connect(warmthL.input);
  dlyR.connect(warmthR.input);
  warmthL.to(highShelfL);
  warmthR.to(highShelfR);
  highShelfL.connect(fbL);
  highShelfR.connect(fbR);
  fbL.connect(dlyL);
  fbR.connect(dlyR);
  dlyL.connect(merge, 0, 0);
  dlyR.connect(merge, 0, 1);
  merge.connect(busGain);
  busGain.connect(output);


  return { rightTime, leftTime, time, feedback, input, output, to };
}
