import { context } from './Context.js'
import Waveshaper from './Waveshaper.js'
import Convolver from './Convolver.js'
import Dynamics from './Dynamics.js'
import { diff, prediff } from './audio/diffusion.js'

export default function Delay(rate) {
  const delay = context.createDelay(3);
  const highPass = context.createBiquadFilter();
  const highShelf = context.createBiquadFilter();
  const lowPass = context.createBiquadFilter();
  const saturation = Waveshaper(30);
  const prediffusor = Convolver(prediff);
  const diffusor = Convolver(diff);
  const dynamics = Dynamics();
  const fb = context.createGain();
  const wetGain = context.createGain();
  const delayLevel = context.createGain();
  const diffusorLevel = context.createGain();
  const input = context.createGain();
  const output = context.createGain();


  input.gain.value = 1;
  output.gain.value = 1;
  fb.gain.value = 0.5;
  wetGain.gain.value = 1;
  delayLevel.gain.value = 1;
  diffusorLevel.gain.value = 0;
  diffusor.output.gain.value = 0.9;
  saturation.drive.value = 0.25;
  saturation.output.gain.value = 1;

  if (rate) {
    let dRate = rate / 1000;
    delay.delayTime.value = dRate
  } else {
    delay.delayTime.value = 0.5;
  }

  lowPass.type = 'lowpass';
  lowPass.frequency.value = 10000;
  highShelf.type = 'highshelf';
  highShelf.frequency.value = 6000;
  highShelf.gain.value = -10;
  highPass.type = 'highpass';
  highPass.frequency.value = 300;

  function diffusion(d) {
    let gain1 = Math.cos(d * 0.5*Math.PI);
    let gain2 = Math.cos((1.0-d) * 0.5*Math.PI);
    delayLevel.gain.setValueAtTime(gain1, context.currentTime);
    diffusorLevel.gain.setValueAtTime(gain2, context.currentTime);
  }

  function warmth(w) {
    let wVal = w / 100;
    let gVal = wVal * 1.5;
    saturation.drive.value = 0.25 + wVal;
    saturation.output.gain.value = 1 - gVal;
  }

  function time(t) {
    let dTime = t / 1000;
    delay.delayTime.value = dTime;
  }

  function feedback(amt) {
    let fbLev = amt / 10;
    fb.gain.value = fbLev;
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(saturation.input);
  saturation.to(wetGain);
  wetGain.connect(highPass);
  highPass.connect(delay);
  delay.connect(highShelf);
  highShelf.connect(fb);
  fb.connect(delay);
  delay.connect(delayLevel);
  delay.connect(diffusorLevel);
  diffusorLevel.connect(diffusor.input);
  diffusor.to(lowPass);

  lowPass.connect(output);
  delayLevel.connect(output);





  return {input, output, warmth, diffusion, time, feedback, to};

}
