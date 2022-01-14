import {context} from './Context.js'
import Waveshaper from './Waveshaper.js'

export default function DoubleDelay(rate) {
  const dlyL = context.createDelay(2);
  const dlyR = context.createDelay(2);
  const spread = context.createDelay(0.04);
  const panL = context.createStereoPanner();
  const panR = context.createStereoPanner();
  const warmthL = Waveshaper(30);
  const warmthR = Waveshaper(30);
  const highShelfL = context.createBiquadFilter();
  const highShelfR = context.createBiquadFilter();
  const highPass = context.createBiquadFilter();
  const fbL = context.createGain();
  const fbR = context.createGain();
  const busL = new GainNode(context, {channelCountMode: 'explicit', channelCount: 1});
  const busR = new GainNode(context, {channelCountMode: 'explicit', channelCount: 1});
  const busGain = context.createGain();
  const wetGain = context.createGain();
  const input = context.createGain();
  const output = context.createGain();

  // const split= context.createChannelSplitter(2);
  const merge = context.createChannelMerger(2);

  let timeLeft = dlyL.delayTime;
  let timeRight = dlyR.delayTime;

  input.gain.value = 1;
  output.gain.value = 1;
  fbL.gain.value = fbR.gain.value = 0.7;
  wetGain.gain.value = 1;
  busGain.gain.value = 0.9;
  warmthL.output.gain.value = 1;
  warmthR.output.gain.value = 1;
  warmthL.drive.value = 0.15;
  warmthR.drive.value = 0.15;
  panL.pan.value = -1;
  panR.pan.value = 1;

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

  function width(w) {
    let spreadVal = w/10;
    panL.pan.value = 0 - spreadVal;
    panR.pan.value = 0 + spreadVal;
  }

  function time(t) {
    let dTimeL = t / 1000;
    let dTimeR = dTimeL / 2;
    timeLeft.exponentialRampToValueAtTime(dTimeL, context.currentTime + 0.1);
    timeRight.exponentialRampToValueAtTime(dTimeR, context.currentTime + 0.1);
  }

  function leftTime(t) {
    let dTime = t / 1000;
    timeLeft.exponentialRampToValueAtTime(timeLeft.value + dTime, context.currentTime + 0.1);
  }

  function rightTime(t) {
    let dTime = t / 1000;
    timeRight.exponentialRampToValueAtTime(timeRight.value + dTime, context.currentTime + 0.1);
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

  highPass.connect(dlyL);
  highPass.connect(dlyR);

  dlyL.connect(warmthL.input);
  dlyR.connect(warmthR.input);

  warmthL.to(highShelfL);
  warmthR.to(highShelfR);

  highShelfL.connect(fbL);
  highShelfR.connect(fbR);

  fbL.connect(dlyL);
  fbR.connect(dlyR);

  dlyL.connect(busL);
  dlyR.connect(busR);

  busL.connect(panL);
  busR.connect(panR);

  panL.connect(output);
  panR.connect(output);

  // merge.connect(output);


  return { time, rightTime, leftTime, feedback, width, input, output, to };
}
